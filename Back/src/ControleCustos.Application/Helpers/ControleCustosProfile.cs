using AutoMapper;
using ControleCustos.Application.Dtos;
using ControleCustos.Domain;
using ControleCustos.Domain.Identity;

namespace ControleCustos.Application.Helpers
{
    public class ControleCustosProfile : Profile
    {
        public ControleCustosProfile()
        {
            CreateMap<Conta, ContaDto>().ReverseMap();

            CreateMap<Fornecedor, FornecedorDto>().ReverseMap();

            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<User, UserLoginDto>().ReverseMap();
            CreateMap<User, UserUpdateDto>().ReverseMap();
        }
    }
}
