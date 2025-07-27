import React, { useCallback } from "react";

const MapMarker = ({
  store,
  map,
  isSelected,
  onStoreSelect,
  onMarkerClick,
  createStoreInfoContent,
}) => {
  const createMarker = useCallback(() => {
    if (!store.latitude || !store.longitude) return null;

    const position = new window.kakao.maps.LatLng(
      store.latitude,
      store.longitude
    );

    // 세련된 마커 이미지 설정
    const imageSrc = isSelected
      ? "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_blue.png"
      : "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png";
    const imageSize = new window.kakao.maps.Size(31, 35);
    const imageOption = { offset: new window.kakao.maps.Point(27, 69) };

    const markerImage = new window.kakao.maps.MarkerImage(
      imageSrc,
      imageSize,
      imageOption
    );

    const marker = new window.kakao.maps.Marker({
      position: position,
      map: map,
      image: markerImage,
    });

    // 인포윈도우 생성
    const infowindow = new window.kakao.maps.InfoWindow({
      content: createStoreInfoContent(store),
      removable: false,
      zIndex: 1,
    });

    // 마커 클릭 이벤트
    window.kakao.maps.event.addListener(marker, "click", () => {
      onStoreSelect(store);
      onMarkerClick(store.id, infowindow);
      infowindow.open(map, marker);
    });

    // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록
    window.kakao.maps.event.addListener(marker, "mouseover", () => {
      infowindow.open(map, marker);
    });

    window.kakao.maps.event.addListener(marker, "mouseout", () => {
      if (!isSelected) {
        infowindow.close();
      }
    });

    return { marker, infowindow };
  }, [
    store,
    map,
    isSelected,
    onStoreSelect,
    onMarkerClick,
    createStoreInfoContent,
  ]);

  return null; // 이 컴포넌트는 마커를 생성하는 로직만 담당
};

export default MapMarker;
