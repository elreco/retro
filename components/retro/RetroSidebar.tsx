import { useState, type CSSProperties } from "react";
import { Check, ChevronLeft, ChevronRight, Home, LifeBuoy, Link2, UserRound } from "lucide-react";
import type { MeetingPhase, Participant, Room } from "@/lib/retro/types";
import { TROLL_PORTAL_ID } from "@/lib/retro/troll";
import { useTherapyDiscussMode } from "@/components/retro/useTherapyDiscussMode";
import { PersonAvatar } from "@/components/retro/PersonAvatar";
import { cn } from "@/lib/utils";

type RetroSidebarProps = {
  room: Room;
  participant: Participant;
  currentPhase: MeetingPhase;
  collapsed: boolean;
  isCompactScreen: boolean;
  onToggleCollapsed: () => void;
  onOpenSupport: () => void;
  onExitHome: () => void;
};

type SidebarStepId = "joining" | "reflect" | "group" | "vote" | "discuss";
type StepState = "complete" | "active" | "upcoming";

const SIDEBAR_STEPS: Array<{ id: SidebarStepId; label: string; status: string }> = [
  { id: "joining", label: "Joining", status: "Room setup" },
  { id: "reflect", label: "Reflect", status: "Write cards" },
  { id: "group", label: "Group", status: "Cluster themes" },
  { id: "vote", label: "Vote", status: "Prioritise" },
  { id: "discuss", label: "Discuss", status: "Decide next steps" }
];

const HEADER_BLOCK = "max-h-[76px] min-h-[76px] overflow-hidden";
const USER_ROW = "min-h-[56px] h-[56px]";
const STEP_ROW = "min-h-[56px]";
const MEETING_CARD = "min-h-[5.5rem]";

/** Collapsed rail width — CSS var for any consumers. */
const RAIL_W = 92;

/** Labels hide horizontally without changing layout: zero width + no opacity hit on geometry. */
function labelClip(collapsed: boolean) {
  return collapsed ? "max-w-0 overflow-hidden opacity-0" : "max-w-[220px] opacity-100";
}

export function RetroSidebar({ room, participant, currentPhase, collapsed, isCompactScreen, onToggleCollapsed, onOpenSupport, onExitHome }: RetroSidebarProps) {
  const [linkCopied, setLinkCopied] = useState(false);
  const activeStep: SidebarStepId = room.status === "waiting" ? "joining" : currentPhase;
  const currentIndex = SIDEBAR_STEPS.findIndex((step) => step.id === activeStep);
  const discuss = currentPhase === "discuss";
  const clip = labelClip(collapsed);
  const therapyDiscuss = useTherapyDiscussMode(currentPhase, room.created_at);

  const asideRailVar = collapsed ? ({ ["--retro-rail-w"]: `${RAIL_W}px` } as CSSProperties) : undefined;

  return (
    <aside
      style={asideRailVar}
      className={cn(
        "relative flex h-full min-h-0 shrink-0 flex-col overflow-hidden border-[#ded8e8]/80 bg-white/76 py-5 text-slate-900 shadow-[16px_0_50px_rgba(49,46,78,0.06)] backdrop-blur-2xl",
        collapsed ? "px-0" : "px-3",
        "transition-[width] duration-200 ease-out motion-reduce:transition-none",
        collapsed ? "w-[92px]" : "w-[280px]",
        "max-md:z-[55] max-md:border-b max-md:border-r-0 md:border-r",
        isCompactScreen && !collapsed && "max-md:fixed max-md:left-0 max-md:top-0 max-md:h-dvh max-md:shadow-2xl"
      )}
    >
      <button
        type="button"
        onClick={onToggleCollapsed}
        className={cn(
          "group absolute top-5 z-[60] grid h-8 w-8 cursor-pointer select-none place-items-center rounded-full border border-[#ded8e8] bg-white/80 text-slate-500 shadow-sm backdrop-blur-xl transition-colors duration-200 ease-out hover:bg-[#343052] hover:text-white hover:shadow-[0_14px_35px_rgba(49,46,78,0.16)] active:scale-95 motion-reduce:transition-none",
          collapsed ? "left-1/2 -translate-x-1/2" : "right-3"
        )}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight className="pointer-events-none h-4 w-4 transition group-hover:translate-x-0.5" /> : <ChevronLeft className="pointer-events-none h-4 w-4 transition group-hover:-translate-x-0.5" />}
      </button>

      <div
        role="region"
        aria-label="Retrospective sidebar content"
        tabIndex={0}
        className="mt-14 flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-y-contain outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#8c83ad]"
      >
        <div className={cn("flex shrink-0 items-start pr-10", HEADER_BLOCK)}>
          <div className="min-w-0 flex-1 overflow-hidden">
            <p
              className={cn(
                "text-[10px] font-bold uppercase tracking-[0.24em] text-[#827b9f] transition-[max-width,opacity] duration-200 ease-out motion-reduce:transition-none",
                clip
              )}
            >
              Retrospective
            </p>
            <h1
              className={cn(
                "mt-2 line-clamp-2 min-h-[2.75rem] text-xl font-bold leading-[1.1] tracking-[-0.04em] text-slate-950 transition-[max-width,opacity] duration-200 ease-out motion-reduce:transition-none",
                clip
              )}
            >
              {room.name}
            </h1>
          </div>
        </div>

        <div
          className={cn(
            "mt-4 flex shrink-0 items-center gap-2.5 rounded-2xl border border-[#ded8e8]/90 bg-white/68 p-2.5 shadow-sm",
            USER_ROW,
            collapsed ? "justify-center border-transparent bg-transparent shadow-none" : "justify-start"
          )}
        >
          <PersonAvatar
            name={participant.name}
            color={participant.avatar_color}
            size="sm"
            title={collapsed ? `${participant.name} (you)` : undefined}
          />
          <div
            className={cn(
              "min-w-0 shrink-0 overflow-hidden transition-[max-width,opacity] duration-200 ease-out motion-reduce:transition-none",
              clip
            )}
          >
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#827b9f]">
              <UserRound className="h-3 w-3 shrink-0" />
              You
            </div>
            <p className="truncate text-sm font-semibold leading-5 text-slate-800">{participant.name}</p>
          </div>
        </div>

        <nav className={cn("min-h-0 shrink-0 overflow-x-hidden", discuss ? "mt-4" : "mt-6")} aria-label="Retro progress">
          <p
            className={cn(
              "mb-2 h-4 overflow-hidden px-1 text-[10px] font-bold uppercase leading-4 tracking-[0.22em] text-[#9a94ad] transition-[max-width,opacity] duration-200 ease-out motion-reduce:transition-none",
              clip
            )}
          >
            Workflow
          </p>
          <ol
            className={cn(
              "flex flex-col gap-1 rounded-[1.35rem] border border-[#ded8e8]/80 bg-white/54 p-2.5 shadow-sm",
              collapsed && "items-center border-transparent bg-transparent shadow-none"
            )}
          >
            {SIDEBAR_STEPS.map((step, index) => {
              const active = step.id === activeStep;
              const complete = index < currentIndex;
              const state: StepState = complete ? "complete" : active ? "active" : "upcoming";
              const stepMainLabel = step.id === "discuss" && therapyDiscuss ? "Therapy session" : step.label;
              return (
                <li key={step.id} title={collapsed ? stepMainLabel : undefined} aria-current={active ? "step" : undefined} className={cn("relative", STEP_ROW)}>
                  {index < SIDEBAR_STEPS.length - 1 ? (
                    <span
                      className={cn(
                        "absolute top-[2.875rem] z-0 h-5 w-px rounded-full transition-colors duration-200 ease-out motion-reduce:transition-none",
                        collapsed ? "left-1/2 -translate-x-1/2" : "left-[22px]",
                        complete ? "bg-[#bcb5ce]" : "bg-[#e5e0ec]"
                      )}
                    />
                  ) : null}
                  <div
                    className={cn(
                      "relative z-10 flex h-full min-h-[56px] w-full cursor-default items-center rounded-2xl text-left transition-colors",
                      collapsed ? "justify-center gap-0 px-0 py-0" : "gap-3 px-2.5 py-2.5 justify-start",
                      !collapsed && active && "bg-[#343052] text-white shadow-[0_16px_34px_-24px_rgba(52,48,82,0.72)]",
                      collapsed &&
                        active &&
                        "mx-auto h-11 w-11 shrink-0 rounded-full border-0 bg-[#343052] px-0 py-0 text-white shadow-[0_16px_34px_-24px_rgba(52,48,82,0.72)]",
                      collapsed && !active && "border-0 bg-transparent shadow-none",
                      state === "complete" && (!collapsed || !active) && "text-[#4f4974]",
                      state === "upcoming" && (!collapsed || !active) && "text-slate-400"
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[11px] font-bold",
                        active && "border-white/35 bg-white/18 text-white",
                        state === "complete" && "border-[#d5cfe2] bg-[#eeeaf5] text-[#4f4974]",
                        state === "upcoming" && "border-[#e5e1ec] bg-white/72 text-slate-400"
                      )}
                    >
                      {complete ? <Check className="h-3.5 w-3.5" /> : active ? <span className="h-2 w-2 rounded-full bg-current" /> : index + 1}
                    </span>
                    <span
                      className={cn(
                        "min-w-0 overflow-hidden transition-[max-width,opacity] duration-200 ease-out motion-reduce:transition-none",
                        clip
                      )}
                    >
                      <span
                        className={cn(
                          "block text-sm font-bold leading-5",
                          step.id === "discuss" && therapyDiscuss && (active ? "text-violet-100" : "text-[#7c6aa8]")
                        )}
                      >
                        {stepMainLabel}
                      </span>
                      <span className={cn("block truncate text-[11px] font-semibold leading-4", active ? "text-white/68" : "text-[#8a849d]")}>
                        {active ? "Current phase" : complete ? "Completed" : step.status}
                      </span>
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className={cn("shrink-0 space-y-1.5 overflow-x-hidden", discuss ? "mt-4" : "mt-5")}>
          <p
            className={cn(
              "h-4 overflow-hidden px-1 text-[10px] font-bold uppercase leading-4 tracking-[0.22em] text-[#9a94ad] transition-[max-width,opacity] duration-200 ease-out motion-reduce:transition-none",
              clip
            )}
          >
            Room
          </p>
          <button
            type="button"
            onClick={async () => {
              if (typeof window === "undefined") {
                return;
              }
              await navigator.clipboard.writeText(window.location.href);
              setLinkCopied(true);
              window.setTimeout(() => setLinkCopied(false), 1600);
            }}
            title="Copy retro link"
            className={cn(
              "flex h-9 shrink-0 items-center rounded-xl border border-[#ded8e8]/75 bg-white/48 text-xs font-bold text-slate-500 transition-colors hover:border-[#c9c2d7] hover:bg-white/72 hover:text-[#4f4974]",
              collapsed ? "mx-auto w-9 justify-center px-0" : "w-full justify-start gap-2.5 px-2.5"
            )}
          >
            <Link2 className="h-3.5 w-3.5 shrink-0" />
            <span
              className={cn(
                "min-w-0 truncate transition-[max-width,opacity] duration-200 ease-out motion-reduce:transition-none",
                clip
              )}
            >
              {linkCopied ? "Link copied" : "Share link"}
            </span>
          </button>
          <button
            type="button"
            onClick={onExitHome}
            title="Back home"
            className={cn(
              "flex h-9 shrink-0 items-center rounded-xl border border-[#ded8e8]/75 bg-white/48 text-xs font-bold text-slate-600 transition-colors hover:border-[#c9c2d7] hover:bg-white/72 hover:text-[#343052]",
              collapsed ? "mx-auto w-9 justify-center px-0" : "w-full justify-start gap-2.5 px-2.5"
            )}
          >
            <Home className="h-3.5 w-3.5 shrink-0" />
            <span
              className={cn(
                "min-w-0 truncate transition-[max-width,opacity] duration-200 ease-out motion-reduce:transition-none",
                clip
              )}
            >
              Back home
            </span>
          </button>
          <button
            type="button"
            onClick={onOpenSupport}
            title="Support"
            className={cn(
              "flex h-9 shrink-0 items-center rounded-xl border border-[#ded8e8]/75 bg-white/48 text-xs font-bold text-slate-500 transition-colors hover:border-[#c9c2d7] hover:bg-white/72 hover:text-[#4f4974]",
              collapsed ? "mx-auto w-9 justify-center px-0" : "w-full justify-start gap-2.5 px-2.5"
            )}
          >
            <LifeBuoy className="h-3.5 w-3.5 shrink-0" />
            <span
              className={cn(
                "min-w-0 truncate transition-[max-width,opacity] duration-200 ease-out motion-reduce:transition-none",
                clip
              )}
            >
              Support
            </span>
          </button>
        </div>

        <div className="mt-auto shrink-0 overflow-hidden pt-2">
          {!collapsed && discuss ? (
            <div id={TROLL_PORTAL_ID} className={cn("w-full min-w-0 overflow-hidden", MEETING_CARD)} aria-hidden={false} />
          ) : null}
        </div>
      </div>
    </aside>
  );
}
