namespace QuestPocBackend.Data;

public class LabOrder {
    public int Id { get; set; }

    public string TestName { get; set; } = string.Empty;
    public string PatientId { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}