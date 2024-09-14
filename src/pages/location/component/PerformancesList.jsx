import React, { useState } from "react";
import { usePerformances } from "../../../hooks/usePerformances";
import PerformanceCard from "./PerformanceCard";
import { Spinner, Pagination } from 'react-bootstrap'; // Pagination 추가

// 장르 이름과 장르 코드 매핑
const genreMapping = {
  "연극": "AAAA",
  "서양무용": "BBBC",
  "한국무용": "BBBC",
  "대중무용": "BBBE",
  "서양음악(클래식)": "CCCA",
  "한국음악(국악)": "CCCC",
  "대중음악": "CCCD",
  "복합": "EEEA",
  "서커스/마술": "EEEB",
  "뮤지컬": "GGGA"
};

const PerformancesList = ({ regionCode }) => {
  const [page, setPage] = useState(1); // 현재 페이지 번호 상태 관리
  const { data, error, isLoading } = usePerformances(regionCode, page); // 페이지 번호 전달

  if (isLoading) return (
    <div className="loading-spinner">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  ); // 로딩 중일 때 스피너 표시

  if (error) return <p>오류 발생: {error.message}</p>;

  const performances = data?.dbs?.db || [];

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1); // 다음 페이지로 이동
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1); // 이전 페이지로 이동
    }
  };

  const totalPages = 10; // 전체 페이지 수를 미리 설정하거나 API 응답에서 받아옴

  return (
    <div>
      <div className="row"> {/* 행(row)로 감싸서 한 줄에 4개씩 나오게 설정 */}
        {performances.map((performance) => {
          // 공연 장르를 매핑
          const category = genreMapping[performance.genrenm] || "unknown";
          return (
            <PerformanceCard key={performance.mt20id} performance={performance} category={category} />
          );
        })}
      </div>

      {/* Bootstrap Pagination */}
      <div className="pagination-controls">
        <Pagination>
          <Pagination.First onClick={() => setPage(1)} />
          <Pagination.Prev onClick={handlePreviousPage} disabled={page === 1} />
          {Array.from({ length: totalPages }, (_, i) => (
            <Pagination.Item
              key={i + 1}
              active={i + 1 === page}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={handleNextPage} disabled={page === totalPages} />
          <Pagination.Last onClick={() => setPage(totalPages)} />
        </Pagination>
      </div>
    </div>
  );
};

export default PerformancesList;
