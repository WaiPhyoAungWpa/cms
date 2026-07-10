using Cms.Api.DTOs.Common;

namespace Cms.Api.DTOs.PublicContent;

public class PublicContentListResponseDto
{
    public PagedResponseDto<PublicContentListItemResponseDto> Contents { get; set; } = new();

    public PublicLatestContentResponseDto? LatestContent { get; set; }

    public PublicContentStatsResponseDto Stats { get; set; } = new();
}