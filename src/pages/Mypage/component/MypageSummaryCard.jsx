import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { PiTicketFill } from "react-icons/pi";
import { mypageApi } from "../../../services/mypageApi";

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  margin: 0 16px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RowLeft = styled.div`
  display: flex;
  align-items: center;
`;

const Label = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #888888;
`;

const Value = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: ${(props) => (props.isGuest ? "#cbd5e1" : "#222222")};
`;

const PointCircle = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: ${(props) => (props.isGuest ? "#f1f5f9" : "#fdd756")};
  color: ${(props) => (props.isGuest ? "#cbd5e1" : "#d18000")};
  font-weight: 700;
  font-size: 16px;
  border-radius: 50%;
  margin-right: 8px;
  position: relative;
`;

const IconCircle = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${(props) => (props.isGuest ? "#f1f5f9" : "#4F8DFD")};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
`;

const ClickableRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: ${(props) => (props.clickable ? "pointer" : "default")};
  transition: all 0.2s ease;

  &:hover {
    ${(props) =>
      props.clickable &&
      `
      transform: translateY(-1px);
      opacity: 0.8;
    `}
  }
`;

const MypageSummaryCard = ({ isGuest = false }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await mypageApi.getMypage();

        const userData = res;
        if (userData) {
          setProfile(userData);
        } else {
        }
      } catch (err) {}
    };
    fetchProfile();
  }, []);

  const handlePointClick = () => {
    if (!isGuest) {
      navigate("/point-history");
    }
  };

  // 로딩 중이거나 데이터가 없을 때 기본값 표시
  const currentPoint = profile?.currentPoint || 0;
  const couponCount = profile?.couponCount || 0;

  return (
    <Card>
      <ClickableRow clickable={!isGuest} onClick={handlePointClick}>
        <RowLeft>
          <PointCircle isGuest={isGuest}>P</PointCircle>
          <Label>포인트</Label>
        </RowLeft>
        <Value isGuest={isGuest}>
          {isGuest ? "0p" : `${currentPoint.toLocaleString()}p`}
        </Value>
      </ClickableRow>
      <Row>
        <RowLeft>
          <IconCircle isGuest={isGuest}>
            <PiTicketFill color={isGuest ? "#cbd5e1" : "white"} size={18} />
          </IconCircle>
          <Label>쿠폰</Label>
        </RowLeft>
        <Value isGuest={isGuest}>{isGuest ? "0장" : `${couponCount}장`}</Value>
      </Row>
    </Card>
  );
};

export default MypageSummaryCard;
