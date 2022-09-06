using System.Collections.Generic;

namespace ControleCustos.API.Models
{
    public class DataPoints
    {
        public string Description { get; set; }
        public decimal Value { get; set; }
    }

    public class BuildArrayChart
    {
        public string Target { get; set; }
        public List<DataPoints> dataPoints { get; set; }
    }

}