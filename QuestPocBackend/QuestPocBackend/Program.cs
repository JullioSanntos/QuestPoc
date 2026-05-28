using Microsoft.EntityFrameworkCore;
using QuestPocBackend.Data;
using Scalar.AspNetCore; // Ensure this using directive is added

namespace QuestPocBackend;

public class Program {
    private const string PublicCorsPolicy = "PublicCorsPolicyName";

    public static void Main(string[] args) {
        var builder = WebApplication.CreateBuilder(args);

        var databaseSettings = builder.Configuration
            .GetSection(DatabaseSettings.SectionName)
            .Get<DatabaseSettings>();

        if (builder.Environment.IsDevelopment()) {
            // Use local connection for testing
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(databaseSettings?.DefaultConnection));
        }
        else {
            // Use Azure cloud connection for production
            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(databaseSettings?.AzureConnection));
        }

        builder.Services.AddCors(options => {
            options.AddPolicy(name: PublicCorsPolicy,
                policy => {
                    policy.WithOrigins(
                            "http://localhost:5173",
                            "https://quest-diagnostics-poc.vercel.app"
                        )
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
        });

        builder.Services.AddControllers();

        // 1. Native .NET 10 API Documentation Service
        builder.Services.AddOpenApi();

        var app = builder.Build();

        app.UseRouting();

        // Apply CORS policy BEFORE authorization and Controllers
        app.UseCors(PublicCorsPolicy);
        app.UseAuthorization();

        app.MapControllers();

        // 2. Map the documentation generation and interactive UI endpoints
        app.MapOpenApi();             // Exposes raw OpenAPI metadata spec
        app.MapScalarApiReference();  // Exposes interactive visual UI

        app.Run();
    }
}