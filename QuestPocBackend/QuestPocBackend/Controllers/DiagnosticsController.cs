using Microsoft.AspNetCore.Mvc;
using QuestPocBackend.Data;
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

    // POST: api/diagnostics/orders
    [HttpPost("orders")]
    public async Task<ActionResult<LabOrder>> PostOrder([FromBody] LabOrder newOrder) {
        // The model binder ensures newOrder is instantiated and valid based on your rules
        _context.LabOrders.Add(newOrder);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetOrders), new { id = newOrder.Id }, newOrder);
    }
}