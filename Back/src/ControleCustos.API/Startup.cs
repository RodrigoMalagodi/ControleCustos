using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using ControleCustos.Application.Contextos;
using ControleCustos.Application.Contratos;
using ControleCustos.Persistence.Contexto;
using ControleCustos.Persistence.Repositorio;
using ControleCustos.Persistence.Contratos;
using System;
using System.Text.Json.Serialization;
using ControleCustos.Domain.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Collections.Generic;
using ControleCustos.API.Helpers;
using Microsoft.Extensions.FileProviders;
using System.IO;
using Microsoft.AspNetCore.Http;

namespace ControleCustos.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<ControleCustosContext>(
                context => context.UseSqlite(Configuration.GetConnectionString("Default"))
            );

            services.AddIdentityCore<User>(
                options => 
                {
                    options.Password.RequireDigit = false;
                    options.Password.RequireNonAlphanumeric = false;
                    options.Password.RequireLowercase = false;
                    options.Password.RequireUppercase = false;
                    options.Password.RequiredLength = 4;
                }
            )
            .AddRoles<Role>()
            .AddRoleManager<RoleManager<Role>>()
            .AddSignInManager<SignInManager<User>>()
            .AddRoleValidator<RoleValidator<Role>>()
            .AddEntityFrameworkStores<ControleCustosContext>()
            .AddDefaultTokenProviders();

             services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters= new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["TokenKey"])),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });
            
            services.AddControllers()
            .AddJsonOptions(
                    options =>
                        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter())
                )
                .AddNewtonsoftJson(
                    options =>
                        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft
                            .Json
                            .ReferenceLoopHandling
                            .Ignore
                );
            
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            #region Services
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<IContaService, ContaService>();
            services.AddScoped<IFornecedorService, FornecedorService>();
            services.AddScoped<IDashBoardService, DashBoardService>();
            #endregion

            #region Persists
            services.AddScoped<IGeralPersist, GeralPersist>();
            services.AddScoped<IUserPersist, UserPersist>();
            services.AddScoped<IContaPersist, ContaPersist>();
            services.AddScoped<IFornecedorPersist, FornecedorPersist>();
            services.AddScoped<IDashboardPersist, DashboardPersist>();
            #endregion
            
            #region Util
            services.AddScoped<IUtil,Util>(); 
            #endregion

            services.AddCors(
                options =>
                {
                    options.AddPolicy("CorsPolicy", builder => builder
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .Build()
                    );
                }
            );
            services.AddSwaggerGen(
                options =>
                {
                    options.SwaggerDoc("v1", new OpenApiInfo { Title = "ControleCustos.API", Version = "v1" });
                    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                    {
                        Description = @"JWT Authorization header usando Bearer.
                                    Entre com 'Bearer ' [espaço] então coloque seu token.
                                    Exemplo: 'Bearer 12345abcdef'",
                        Name = "Authorization",
                        In = ParameterLocation.Header,
                        Type = SecuritySchemeType.ApiKey,
                        Scheme = "Bearer"
                    });

                    options.AddSecurityRequirement(new OpenApiSecurityRequirement()
                    {
                        {
                            new OpenApiSecurityScheme
                            {
                                Reference = new OpenApiReference
                                {
                                    Type = ReferenceType.SecurityScheme,
                                    Id = "Bearer"
                                },
                                Scheme = "oauth2",
                                Name = "Bearer",
                                In = ParameterLocation.Header
                            },
                            new List<string>()
                        }
                    });
                }
            );

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(
                    c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "ControleCustos.API v1")
                );
            }
            else
            {
                app.UseHttpsRedirection();
            }

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseHttpsRedirection(); 
            app.UseCors(x => x
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader());

            app.UseStaticFiles(
                new StaticFileOptions()
                {
                    FileProvider = new PhysicalFileProvider(
                        Path.Combine(Directory.GetCurrentDirectory(), "Resources")
                    ),
                    RequestPath = new PathString("/Resources")
                }
            );

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
