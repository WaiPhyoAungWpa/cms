using Cms.Api.Entities.Enums;

namespace Cms.Api.DTOs.Content;

public class RestoreContentRequestDto
{
    public VisibilityStatus VisibilityStatus { get; set; }
}