import React from "react";

const MapControls = ({ map, onLocationUpdate }) => {
  const initializeMapControls = () => {
    if (!map) return;

    // 지도 클릭 이벤트
    window.kakao.maps.event.addListener(map, "click", (mouseEvent) => {
      const latlng = mouseEvent.latLng;
      onLocationUpdate({
        latitude: latlng.getLat(),
        longitude: latlng.getLng(),
      });
    });

    // 더블클릭 이벤트 완전 비활성화
    window.kakao.maps.event.addListener(map, "dblclick", (mouseEvent) => {
      mouseEvent.preventDefault();
      return false;
    });
  };

  React.useEffect(() => {
    initializeMapControls();
  }, [map]);

  return null;
};

export default MapControls;
