namespace QuestPocBackend.Data; 

public class DatabaseSettings {
    public const string SectionName = "ConnectionStrings";

    // Maps automatically to "DefaultConnection"
    public string DefaultConnection { get; set; } = string.Empty;

    // Maps automatically to "Azure"
    public string AzureConnection { get; set; } = string.Empty;
}
