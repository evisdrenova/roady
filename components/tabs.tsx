"use client";
import { useState } from "react";
import { motion } from "framer-motion";

type Tab = {
  title: string;
  value: string;
};

interface TabProps {
  tabs: Tab[];
  onTabChange: (value: string) => void;
}

export const Tabs = (props: TabProps) => {
  const { tabs: propTabs, onTabChange } = props;
  const [active, setActive] = useState<Tab>(propTabs[0]);
  const [tabs, setTabs] = useState<Tab[]>(propTabs);

  const moveSelectedTabToTop = (idx: number) => {
    const newTabs = [...propTabs];
    const selectedTab = newTabs.splice(idx, 1);
    newTabs.unshift(selectedTab[0]);
    setTabs(newTabs);
    setActive(newTabs[0]);
    onTabChange(newTabs[0].value);
  };

  return (
    <>
      <div className="flex flex-row items-center justify-start [perspective:1000px] relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-full p-[2px] rounded-lg border border-gray-200">
        {propTabs.map((tab, idx) => (
          <button
            type="button"
            key={tab.title}
            onClick={() => {
              moveSelectedTabToTop(idx);
            }}
            className="relative px-2 py-2 rounded-lg"
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {active.value === tab.value && (
              <motion.div
                layoutId="clickedbutton"
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                className="absolute inset-0 bg-gray-200 dark:bg-zinc-800 rounded-lg "
              />
            )}

            <span className="relative block text-black dark:text-white text-sm">
              {tab.title}
            </span>
          </button>
        ))}
      </div>
    </>
  );
};
