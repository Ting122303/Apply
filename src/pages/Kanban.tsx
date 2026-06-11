import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { useApps } from '../App';
import { STAGE_ORDER, STAGE_ICONS } from '../lib/types';
import type { Stage } from '../lib/types';
import { daysAgo, isOverdue } from '../lib/storage';

export default function Kanban() {
  const { applications, updateApp } = useApps();

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return;
    const appId = result.draggableId;
    const newStage = result.destination.droppableId as Stage;
    updateApp(appId, { stage: newStage });
  }

  // 获取下一阶段
  function nextStage(current: Stage): Stage | null {
    const idx = STAGE_ORDER.indexOf(current);
    if (idx < 0 || idx >= STAGE_ORDER.length - 1) return null;
    return STAGE_ORDER[idx + 1];
  }

  // 一键推进到下一阶段
  function advanceStage(appId: string, currentStage: Stage, e: React.MouseEvent) {
    e.stopPropagation();  // 阻止冒泡，不触发编辑弹窗
    const next = nextStage(currentStage);
    if (next) updateApp(appId, { stage: next });
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 min-h-[calc(100vh-160px)]">
        {STAGE_ORDER.map(stage => {
          const items = applications.filter(a => a.stage === stage);
          return (
            <Droppable droppableId={stage} key={stage}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`bg-app-card-tint rounded-app p-3.5 border-2 border-dashed transition-all flex flex-col gap-2 min-h-[300px] ${
                    snapshot.isDraggingOver
                      ? 'border-app-accent bg-app-accent-light'
                      : 'border-app-border-light'
                  }`}
                >
                  {/* Column header */}
                  <div className="flex items-center justify-between pb-2.5 mb-1 border-b-2 border-app-border">
                    <h3 className="text-[13px] font-semibold text-app-text">
                      {STAGE_ICONS[stage]} {stage}
                    </h3>
                    <span className="text-[15px] font-bold text-app-accent-hover bg-white px-3 py-0.5 rounded-2xl border border-app-border tabular-nums">
                      {items.length}
                    </span>
                  </div>

                  {/* Cards */}
                  {items.map((app, index) => {
                    const overdue = isOverdue(app);
                    return (
                      <Draggable draggableId={app.id} index={index} key={app.id}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() =>
                              window.dispatchEvent(new CustomEvent('open-form', { detail: app.id }))
                            }
                            className={`bg-white border border-app-border rounded-app-sm p-3.5 cursor-grab active:cursor-grabbing transition-all relative hover:shadow-md hover:border-[#b0b9c5] ${
                              snapshot.isDragging ? 'opacity-50 scale-95 shadow-lg' : 'shadow-sm'
                            }`}
                          >
                            {overdue && (
                              <span
                                className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[#e09080]"
                                style={{ boxShadow: '0 0 0 3px rgba(224,144,128,0.25)' }}
                                title="已停留较久，建议跟进"
                              />
                            )}
                            <div className="font-semibold text-sm text-app-text mb-0.5">{app.company}</div>
                            <div className="text-xs text-app-text-secondary mb-1.5">{app.position}</div>
                            <div className="flex items-center gap-2 text-[11px] text-app-text-muted">
                              <span>{app.date}</span>
                              <span className={overdue ? 'text-[#c07668] font-semibold' : ''}>
                                {daysAgo(app.createdAt)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between mt-1.5">
                              <span className="inline-block text-[10px] px-2 py-0.5 rounded font-medium bg-app-accent-light text-app-accent-hover">
                                {app.channel}
                              </span>
                              {nextStage(app.stage) && (
                                <button
                                  onClick={(e) => advanceStage(app.id, app.stage, e)}
                                  title={`推进到「${nextStage(app.stage)}」`}
                                  className="text-[10px] px-2 py-0.5 rounded font-medium border border-app-border bg-white text-app-text-muted hover:border-app-accent hover:text-app-accent-hover hover:bg-app-accent-light transition-all"
                                >
                                  推进 →
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}

                  {/* Empty state */}
                  {items.length === 0 && (
                    <div className="text-center py-8 text-app-text-muted text-[11px]">
                      {snapshot.isDraggingOver ? '松手放到这里' : '拖拽卡片到这里'}
                    </div>
                  )}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </DragDropContext>
  );
}
