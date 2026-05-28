using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using QuestPocBackend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuestPocBackend.Data;

namespace QuestPocBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DiagnosticsController : ControllerBase {
    private readonly AppDbContext _context;

    // EF Core injects your AppDbContext here automatically
    public DiagnosticsController(AppDbContext context) {
        _context = context;
    }

    // GET: api/diagnostics/orders
    [HttpGet("orders")]
    public async Task<ActionResult<IEnumerable<LabOrder>>> GetOrders() {
        // Entity Framework automatically creates the connection, 
        // runs the SELECT script, reads the data, and maps the types!
        return await _context.LabOrders.ToListAsync();
    }
}