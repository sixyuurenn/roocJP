"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { JobTier, SkillDiffItem, SkillItem } from "@/data/skills";

type SkillLevelKey = "lv1" | "lvMax";

const jobTierTabs: { key: JobTier; label: string }[] = [
  { key: "basic", label: "基本スキル" },
  { key: "first", label: "1次職" },
  { key: "second", label: "2次職" },
  { key: "advancedSecond", label: "上位2次職" },
];

const levelOptions: { key: SkillLevelKey; label: string }[] = [
  { key: "lv1", label: "Lv1" },
  { key: "lvMax", label: "LvMAX" },
];

function renderHighlightedBody(body: string, diffStats: SkillDiffItem[], shouldHighlight: boolean) {
  if (!shouldHighlight) {
    return body;
  }

  const highlightTerms = Array.from(
    new Set(
      diffStats
        .filter((item) => item.from !== item.to)
        .map((item) => item.to)
        .filter((value) => value.length > 0),
    ),
  ).sort((a, b) => b.length - a.length);

  if (highlightTerms.length === 0) {
    return body;
  }

  const escapedTerms = highlightTerms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const parts = body.split(new RegExp(`(${escapedTerms.join("|")})`, "g"));

  return parts.map((part, index) =>
    highlightTerms.includes(part) ? (
      <span key={`${part}-${index}`} className="font-bold text-rose-600">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

function getCurrentValue(level: SkillLevelKey, lv1Value: string, lvMaxValue: string) {
  return level === "lv1" ? lv1Value : lvMaxValue;
}

function getValueClassName(level: SkillLevelKey, lv1Value: string, lvMaxValue: string) {
  return level === "lvMax" && lv1Value !== lvMaxValue ? "font-bold text-rose-600" : "font-medium text-slate-800";
}

export function JobSkillList({ skills }: { skills: SkillItem[] }) {
  const [selectedTier, setSelectedTier] = useState<JobTier>("second");
  const [selectedLevel, setSelectedLevel] = useState<SkillLevelKey>("lvMax");

  const visibleSkills = useMemo(
    () => skills.filter((skill) => skill.jobTier === selectedTier),
    [selectedTier, skills],
  );

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="overflow-x-auto pb-1">
          <div className="inline-flex min-w-full gap-2 sm:min-w-0">
            {jobTierTabs.map((tab) => {
              const isActive = selectedTier === tab.key;
              const count = skills.filter((skill) => skill.jobTier === tab.key).length;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setSelectedTier(tab.key)}
                  className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "border-base-accent bg-base-accent text-white shadow-sm"
                      : "border-slate-300 bg-white text-slate-700 hover:border-base-accent hover:text-base-accent"
                  }`}
                >
                  {tab.label}
                  {count > 0 ? <span className="ml-1.5 text-xs opacity-80">{count}</span> : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wide text-base-accent">表示レベル</p>
            <p className="mt-1 text-sm text-slate-600">現在の職層タブに表示される全スキルをまとめて切り替えます。</p>
          </div>
          <div className="inline-flex rounded-full border border-slate-300 bg-white p-1">
            {levelOptions.map((option) => {
              const isActive = selectedLevel === option.key;

              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setSelectedLevel(option.key)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive ? "bg-base-accent text-white shadow-sm" : "text-slate-600 hover:text-base-accent"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {visibleSkills.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
          <p className="text-sm font-medium text-slate-700">この職層のスキルはまだありません。</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {visibleSkills.map((skill) => {
            const currentLevel = skill.levelVariants[selectedLevel];
            const lv1 = skill.levelVariants.lv1;
            const lvMax = skill.levelVariants.lvMax;
            const maxLevelLabel = skill.maxLevel === null ? "-" : skill.maxLevel;

            return (
              <article
                key={`${skill.id}:${skill.jobTier}:${skill.sortOrder}:${skill.name}`}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4 sm:p-5"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="relative aspect-square h-14 w-14 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-white sm:h-16 sm:w-16">
                    {skill.icon ? (
                      <Image src={skill.icon} alt="" fill sizes="64px" className="object-cover" />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-stone-200 via-stone-100 to-white" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-base font-semibold leading-6 text-slate-800">{skill.name}</h3>
                        <p className="mt-1 text-xs font-medium text-base-accent">
                          表示中 {selectedLevel === "lv1" ? "Lv1" : "LvMAX"} / 最大 Lv.{maxLevelLabel}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {skill.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-medium leading-none text-slate-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 rounded-lg border border-slate-200 bg-white px-4 py-3">
                      <p className="text-xs font-semibold tracking-wide text-base-accent">スキル本文</p>
                      <div className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-700">
                        {renderHighlightedBody(currentLevel.body, skill.diffStats, selectedLevel === "lvMax")}
                      </div>
                    </div>

                    <dl className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-700 sm:grid-cols-4">
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                        <dt className="text-[11px] font-semibold tracking-wide text-slate-500">詠唱</dt>
                        <dd className={`mt-1 ${getValueClassName(selectedLevel, lv1.castTime, lvMax.castTime)}`}>
                          {getCurrentValue(selectedLevel, lv1.castTime, lvMax.castTime)}
                        </dd>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                        <dt className="text-[11px] font-semibold tracking-wide text-slate-500">CT</dt>
                        <dd className={`mt-1 ${getValueClassName(selectedLevel, lv1.cooldown, lvMax.cooldown)}`}>
                          {getCurrentValue(selectedLevel, lv1.cooldown, lvMax.cooldown)}
                        </dd>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                        <dt className="text-[11px] font-semibold tracking-wide text-slate-500">SP</dt>
                        <dd className={`mt-1 ${getValueClassName(selectedLevel, lv1.spCost, lvMax.spCost)}`}>
                          {getCurrentValue(selectedLevel, lv1.spCost, lvMax.spCost)}
                        </dd>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                        <dt className="text-[11px] font-semibold tracking-wide text-slate-500">ディレイ</dt>
                        <dd className={`mt-1 ${getValueClassName(selectedLevel, lv1.globalDelay, lvMax.globalDelay)}`}>
                          {getCurrentValue(selectedLevel, lv1.globalDelay, lvMax.globalDelay)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
