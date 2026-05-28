
namespace QuestPocBackend {
    public class Program {
        public static void Main(string[] args) {
            var builder = WebApplication.CreateBuilder(args);
            // 1. ADD CORS POLICY (Put this before builder.Build())
            var questCorsPolicy = "_questCorsPolicy";

            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: questCorsPolicy,
                    policy => {
                        policy.WithOrigins("http://localhost:5173") // Allow your Vite (React) dev server
                            .AllowAnyHeader()
                            .AllowAnyMethod();
                    });
            });

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();

            var app = builder.Build();

            app.UseHttpsRedirection();

            // 2. ENABLE CORS POLICY (Put this before UseAuthorization)
            app.UseCors("AllowFrontend");

            app.UseAuthorization();
            app.UseCors(questCorsPolicy); //remember to enable CORS before mapping controllers
            app.MapControllers();

            app.Run();
        }
    }
}
