
namespace QuestPocBackend {
    public class Program {
        public static void Main(string[] args) {
            var builder = WebApplication.CreateBuilder(args);
            // 1. ADD CORS POLICY (Put this before builder.Build())
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader();
                });
            });

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();

            var app = builder.Build();

            app.UseHttpsRedirection();

            // 2. ENABLE CORS POLICY (Put this before UseAuthorization)
            app.UseCors("AllowFrontend");

            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }
    }
}
