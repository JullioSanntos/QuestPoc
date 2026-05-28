using Microsoft.AspNetCore.Mvc;
using QuestPocBackend.Data;
using Microsoft.EntityFrameworkCore;

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
    public async Task<IActionResult> GetActiveOrders() {
        var activeOrders = await _context.LabOrders
            .Where(o => o.DeprecatedAt == null)
            .ToListAsync();

        return Ok(activeOrders);
    }

    // POST: api/diagnostics/orders
    [HttpPost("orders")]
    public async Task<ActionResult<LabOrder>> PostOrder([FromBody] LabOrder newOrder) {
        _context.LabOrders.Add(newOrder);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetActiveOrders), new { id = newOrder.Id }, newOrder);
    }

    [HttpPost("orders/{id}/deprecate")]
    public async Task<IActionResult> DeprecateOrder(int id) {
        var order = await _context.LabOrders.FindAsync(id);
        if (order == null) return NotFound();

        // Soft-delete by stamping the current global standard UTC time
        order.DeprecatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return NoContent();
    }
}