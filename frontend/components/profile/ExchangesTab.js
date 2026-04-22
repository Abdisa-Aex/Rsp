"use client";

import ExchangesList from "./ExchangesList";

const ExchangesTab = ({ exchanges, onReturn, onRate }) => {
  return (
    <ExchangesList exchanges={exchanges} onReturn={onReturn} onRate={onRate} />
  );
};

export default ExchangesTab;
