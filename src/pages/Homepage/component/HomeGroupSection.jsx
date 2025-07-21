import React, { useState } from "react";
import styled from "styled-components";
import { FiChevronRight } from "react-icons/fi";
import TagBadge from "../../../components/TagBadge";
import MeetingDetailModal from "./MeetingDetailModal";

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
const GroupInfo = styled.div`
  flex: 1 1 0%;
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
  font-weight: 800;
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
  background: #f3f4f6;
  color: #222;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  padding: 8px 18px;
  box-shadow: 0 1px 4px 0 rgb(0 0 0 / 0.06);
  transition: background 0.18s, box-shadow 0.18s;
  cursor: pointer;
  &:hover {
    background: #e5e7eb;
    box-shadow: 0 2px 8px 0 rgb(0 0 0 / 0.1);
  }
`;

const groupList = [
  {
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
    title: "30대 초반 맛집 투어 모임",
    author: "김방장",
    tags: [
      { type: "location", text: "성정동" },
      { type: "all", text: "전체" },
    ],
    fullDescription: `천안 30대 환영 !!!\n평일에 퇴근하고 맛집으로 저녁 먹으러 다니실 분 구해요 ☆☆ 맛집 잘 아시는 분 환영 ~\n주로 성정동에서 활동하고, 이외 동네도 좋으니 먹으면 최대한 분 오셔요 좋겠어요\n밥 인원 10명으로 제한해두었습니다\n얼굴 들어와주세요 !!!`,
    desc: "30대 환영 ~ 인스타 맛집 다니고 싶으신 분들 어쩌고 저쩌고 우오아아아아아아",
  },
  {
    image: "https://www.ekn.kr/mnt/file/202412/20241223001203509_1.png",
    title: "신불당 보드게임 카페 다녀요",
    author: "김보드",
    tags: [
      { type: "location", text: "성정동" },
      { type: "weekday", text: "평일" },
    ],
    fullDescription: `보드게임 좋아하시는 분 주말에 모여서 저랑 놀고 어쩌고 저쩌고 \n주로 성정동에서 활동하고, 이외 동네도 좋으니 오셔요~\n밥 인원 10명 제한!`,
    desc: "보드게임 좋아하시는 분 주말에 모여서 저랑 놀고 어쩌고 저쩌고 ",
  },
  {
    image:
      "https://img.kr.gcp-karroter.net/community/community/20240824/14c3cfff-9a94-45d5-a578-d0ddf80ee338.jpeg?q=95&s=1200x630&t=cover",
    title: "분위기 좋은 카페 다니실 분 ~",
    author: "김민지",
    tags: [
      { type: "location", text: "성정동" },
      { type: "weekend", text: "주말" },
    ],
    fullDescription: `천안 30대 환영 !!!\n평일에 퇴근하고 맛집으로 저녁 먹으러 다니실 분 구해요 ☆☆ 맛집 잘 아시는 분 환영 ~\n주로 성정동에서 활동하고, 이외 동네도 좋으니 먹으면 최대한 분 오셔요 좋겠어요\n밥 인원 10명으로 제한해두었습니다\n얼굴 들어와주세요 !!!`,
    desc: "분좋카 많이 아시는 분 환영 들어오세 어쩌고 저쩌고 우오아아아아아아",
  },
];

const HomeGroupSection = () => {
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewClick = (group) => {
    setSelectedMeeting(group);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMeeting(null);
  };

  return (
    <SectionContainer>
      <SectionHeader>
        <SectionTitle>직접 모여 소통해요</SectionTitle>
        <SectionArrow />
      </SectionHeader>
      {groupList.map((group, idx) => (
        <GroupCard key={idx}>
          <GroupImage src={group.image} alt={group.title} />
          <GroupInfo>
            <GroupTitle>{group.title}</GroupTitle>
            <GroupDesc>{group.desc}</GroupDesc>
            <TagRow>
              {group.tags.map((tag, i) => (
                <TagBadge
                  key={i}
                  type={tag.type}
                  text={tag.text}
                  className={i === group.tags.length - 1 ? "last" : ""}
                />
              ))}
            </TagRow>
          </GroupInfo>
          <ViewButton onClick={() => handleViewClick(group)}>보기</ViewButton>
        </GroupCard>
      ))}

      <MeetingDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        meetingData={selectedMeeting}
      />
    </SectionContainer>
  );
};

export default HomeGroupSection;
