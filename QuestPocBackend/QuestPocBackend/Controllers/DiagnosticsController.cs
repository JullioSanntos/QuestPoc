using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace QuestPocBackend.Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class DiagnosticsController : ControllerBase {
        private readonly string _connectionString;

        public DiagnosticsController(IConfiguration configuration) {
            _connectionString = configuration.GetConnectionString("AzureSqlDb")
                ?? throw new ArgumentNullException(nameof(configuration), "Database connection string missing.");
        }

        [HttpGet("orders")]
        public async Task<IActionResult> GetLatestOrders() {
            // MOCK TOGGLE: If you haven't set up Azure SQL yet, return local mock data safely
            if (_connectionString.Contains("YOUR-SERVER-NAME") || string.IsNullOrWhiteSpace(_connectionString)) {
                var mockOrders = new List<LabOrder>
                {
                    new LabOrder { Id = "MOCK-Q83921", TestName = "CMP (Local Mock Data - No DB connected yet)", Status = "Completed", PatientId = "P1001" },
                    new LabOrder { Id = "MOCK-Q83922", TestName = "Hemoglobin A1c (Local Mock)", Status = "In Progress", PatientId = "P1002" }
                };
                return Ok(mockOrders);
            }

            // Real Azure SQL Database Path
            var orders = new List<LabOrder>();

            using (var connection = new SqlConnection(_connectionString)) {
                const string query = "SELECT Id, TestName, Status, PatientId FROM LabOrders";

                using (var command = new SqlCommand(query, connection)) {
                    await connection.OpenAsync();

                    using (var reader = await command.ExecuteReaderAsync()) {
                        while (await reader.ReadAsync()) {
                            orders.Add(new LabOrder {
                                Id = reader["Id"].ToString() ?? string.Empty,
                                TestName = reader["TestName"].ToString() ?? string.Empty,
                                Status = reader["Status"].ToString() ?? string.Empty,
                                PatientId = reader["PatientId"].ToString() ?? string.Empty
                            });
                        }
                    }
                }
            }

            return Ok(orders);
        }
    }

    public class LabOrder {
        public string Id { get; set; } = string.Empty;
        public string TestName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string PatientId { get; set; } = string.Empty;
    }
}