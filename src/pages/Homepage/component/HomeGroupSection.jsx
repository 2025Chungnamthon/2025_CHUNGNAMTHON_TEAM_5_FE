import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import TagBadge from "../../../components/TagBadge";
import MeetingDetailModal from "../../MeetingList/component/MeetingDetailModal";
import { getLocationKorean } from "@/utils/locationUtils.js";

const SectionContainer = styled.div`
  background: #fff;
  border-radius: 28px;
  box-shadow: 0 2px 8px 0 rgb(0 0 0 / 0.06);
  padding: 0 0 8px 0;
  margin-bottom: 14px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 18px 18px 12px 18px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #111;
`;

const SectionArrow = styled(FiChevronRight)`
  color: #bdbdbd;
  font-size: 26px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #9ca3af;
    transform: translateX(2px);
  }
`;

const GroupCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 4px 18px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

const GroupImage = styled.img`
  width: 68px;
  height: 68px;
  border-radius: 14px;
  object-fit: cover;
  background: #f3f4f6;
  flex-shrink: 0;
`;

const GroupImagePlaceholder = styled.div`
  width: 68px;
  height: 68px;
  border-radius: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
`;

const GroupInfo = styled.div`
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  max-width: 100%;
  white-space: normal;
  word-break: break-all;
  padding-right: 8px;
`;

const GroupTitle = styled.div`
  font-weight: 700;
  font-size: 16px;
  color: #181818;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const GroupDesc = styled.div`
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TagRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 2px;
`;

const ViewButton = styled.button`
  background: #F2F4F4;
  color: #222;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  padding: 10px 18px;
  transition: background 0.18s;
  box-shadow: none;
  cursor: pointer;
  &:hover {
    background: #F2F4F4;
  }
`;

// 스케줄을 한글로 변환하는 함수
const getScheduleKorean = (schedule) => {
  const scheduleMap = {
    WEEKDAY: "평일",
    WEEKEND: "주말",
    ALL: "전체",
  };
  return scheduleMap[schedule] || schedule;
};

// 스케줄에 따른 TagBadge 타입 결정
const getScheduleTagType = (schedule) => {
  const typeMap = {
    WEEKDAY: "weekday",
    WEEKEND: "weekend",
    ALL: "all",
  };
  return typeMap[schedule] || "all";
};

const HomeGroupSection = ({ meetings = [] }) => {
  const navigate = useNavigate();
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState(new Set());

  const handleImageError = (imageUrl) => {
    setImageErrors((prev) => new Set(prev).add(imageUrl));
  };

  const isValidImageUrl = (url) => {
    if (!url) return false;
    // 기본 이미지 URL은 유효한 것으로 간주
    if (
      url ===
      "https://www.onlmenu.com/data/file/sb/2040321633_9sUAX5GY_23dd04579a9ee8fb463c129a1b090c2adf37f485.JPG"
    ) {
      return true;
    }
    // example.com, image.com 등은 유효하지 않은 URL로 간주
    const invalidDomains = ["example.com", "image.com"];
    return !invalidDomains.some((domain) => url.includes(domain));
  };

  const getImageUrl = (meeting) => {
    // API 데이터의 imageUrl 필드 사용, 없으면 기본 이미지 사용
    return (
      meeting.imageUrl ||
      "https://www.onlmenu.com/data/file/sb/2040321633_9sUAX5GY_23dd04579a9ee8fb463c129a1b090c2adf37f485.JPG"
    );
  };

  const handleArrowClick = () => {
    navigate("/meetings");
  };

  const handleViewClick = (group) => {
    setSelectedMeeting(group);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMeeting(null);
  };

  const handleRefreshAfterAction = () => {
    // 홈페이지 데이터 새로고침이 필요한 경우 여기서 처리
    console.log("홈페이지 데이터 새로고침");
  };

  return (
    <SectionContainer>
      <SectionHeader>
        <SectionTitle>직접 모여 소통해요</SectionTitle>
        <SectionArrow onClick={handleArrowClick} />
      </SectionHeader>
      {meetings.map((group) => {
        const imageUrl = getImageUrl(group);
        const shouldShowPlaceholder =
          !isValidImageUrl(imageUrl) || imageErrors.has(imageUrl);

        return (
          <GroupCard key={group.id}>
            {shouldShowPlaceholder ? (
              <GroupImagePlaceholder>
                {group.title ? group.title.charAt(0) : "모"}
              </GroupImagePlaceholder>
            ) : (
              <GroupImage
                src={imageUrl}
                alt={group.title}
                onError={() => handleImageError(imageUrl)}
              />
            )}
            <GroupInfo>
              <GroupTitle>{group.title}</GroupTitle>
              <GroupDesc>
                {group.shortDescription ||
                  group.description ||
                  `${getLocationKorean(group.location)} • ${getScheduleKorean(
                    group.schedule
                  )}`}
              </GroupDesc>
              <TagRow>
                <TagBadge
                  type="location"
                  text={getLocationKorean(group.location)}
                />
                <TagBadge
                  type={getScheduleTagType(group.schedule)}
                  text={getScheduleKorean(group.schedule)}
                  className="last"
                />
              </TagRow>
            </GroupInfo>
            <ViewButton onClick={() => handleViewClick(group)}>
              자세히
            </ViewButton>
          </GroupCard>
        );
      })}

      <MeetingDetailModal
        meeting={selectedMeeting}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onRefresh={handleRefreshAfterAction}
        meetingStatus="available"
      />
    </SectionContainer>
  );
};

export default HomeGroupSection;
