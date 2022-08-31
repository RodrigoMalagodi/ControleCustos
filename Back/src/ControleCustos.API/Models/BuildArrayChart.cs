using System.Collections.Generic;

namespace ControleCustos.API.Models
{
    public class DataPoints
    {
        public string Descricao { get; set; }
        public decimal Valor { get; set; }
    }

    public class BuildArrayChart
    {
        public string Target { get; set; }
        public List<DataPoints> dataPoints { get; set; }
    }

}