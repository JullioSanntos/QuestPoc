
using Microsoft.EntityFrameworkCore;
using QuestPocBackend.Data;

namespace QuestPocBackend;

public class Program {
    public static void Main(string[] args) {
        var builder = WebApplication.CreateBuilder(args);
        
        var questCorsPolicy = "_questCorsPolicy";

        builder.Services.AddCors(options => {
            options.AddPolicy(name: questCorsPolicy,
                policy => {
                    policy.AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
        });
        builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("AzureConnection")));
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        var app = builder.Build();

        // Comment this out for local dev to prevent 307 redirect CORS short-circuits
        // app.UseHttpsRedirection();

        // Apply your explicit named CORS policy BEFORE authorization or routing
        app.UseCors(questCorsPolicy);

        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }
}