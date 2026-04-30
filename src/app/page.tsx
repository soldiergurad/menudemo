"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowUp,
  Plus,
  Printer,
  RefreshCcw,
  Trash2,
  Utensils
} from "lucide-react";

type Theme = "classic" | "elegant" | "fresh";
type Density = "normal" | "compact";

type MenuItem = {
  name: string;
  price: string;
  desc: string;
  tags: string;
};

type MenuCategory = {
  name: string;
  items: MenuItem[];
};

type MenuData = {
  name: string;
  meta: string;
  notice: string;
  theme: Theme;
  density: Density;
  categories: MenuCategory[];
};

const storageKey = "single-page-menu-maker";

const defaultData: MenuData = {
  name: "南城小馆",
  meta: "手作家常菜 · 午市 11:00-14:00 · 晚市 17:00-22:00",
  notice: "所有菜品现点现做，可根据口味调整辣度。堂食、外带均可。",
  theme: "classic",
  density: "normal",
  categories: [
    {
      name: "招牌热菜",
      items: [
        {
          name: "砂锅黄焖鸡",
          price: "¥38",
          desc: "鸡腿肉慢炖入味，配土豆、香菇和青椒。",
          tags: "招牌, 微辣"
        },
        {
          name: "黑椒牛柳",
          price: "¥58",
          desc: "嫩牛柳快炒，黑椒香气浓郁。",
          tags: "人气"
        }
      ]
    },
    {
      name: "清爽凉菜",
      items: [
        {
          name: "桂花糯米藕",
          price: "¥26",
          desc: "糯米软甜，桂花蜜收尾。",
          tags: "甜口"
        },
        {
          name: "藤椒手撕鸡",
          price: "¥32",
          desc: "鸡肉细嫩，藤椒清麻开胃。",
          tags: "微麻, 冷盘"
        }
      ]
    },
    {
      name: "主食点心",
      items: [
        {
          name: "葱油拌面",
          price: "¥18",
          desc: "熬香葱油拌细面，简单耐吃。",
          tags: "素食"
        },
        {
          name: "鲜肉小笼",
          price: "¥24",
          desc: "一笼六只，汤汁饱满。",
          tags: "现蒸"
        }
      ]
    },
    {
      name: "饮品甜品",
      items: [
        {
          name: "杨枝甘露",
          price: "¥22",
          desc: "芒果、西柚与椰奶的经典组合。",
          tags: "冰甜品"
        },
        {
          name: "手打柠檬茶",
          price: "¥16",
          desc: "鲜柠现打，茶香清亮。",
          tags: "冰饮"
        }
      ]
    }
  ]
};

const cloneData = (value: MenuData) => structuredClone(value);

const fieldClass =
  "min-h-10 w-full rounded-[var(--radius)] border border-[var(--line)] bg-white px-3 py-2.5 text-[var(--ink)] outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_rgba(184,75,54,.13)]";

const textButtonClass =
  "inline-flex min-h-[38px] items-center justify-center gap-2 rounded-[var(--radius)] border border-[var(--line)] bg-white px-3 text-[var(--ink)] transition hover:-translate-y-px hover:border-[rgba(184,75,54,.55)]";

const iconButtonClass =
  "inline-flex min-h-[32px] w-8 items-center justify-center rounded-[var(--radius)] border border-[var(--line)] bg-white text-[var(--ink)] transition hover:-translate-y-px hover:border-[rgba(184,75,54,.55)]";

export default function Home() {
  const [data, setData] = useState<MenuData>(() => cloneData(defaultData));
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        setData(JSON.parse(saved) as MenuData);
      }
    } catch {
      setData(cloneData(defaultData));
    } finally {
      setHasMounted(true);
    }
  }, []);

  useEffect(() => {
    if (!hasMounted) return;
    window.localStorage.setItem(storageKey, JSON.stringify(data));
  }, [data, hasMounted]);

  const menuPaperClass = useMemo(
    () => `menu-paper ${data.theme} ${data.density} p-[clamp(24px,4vw,54px)]`,
    [data.theme, data.density]
  );

  const updateData = <K extends keyof MenuData>(key: K, value: MenuData[K]) => {
    setData((current) => ({ ...current, [key]: value }));
  };

  const updateCategory = (categoryIndex: number, name: string) => {
    setData((current) => ({
      ...current,
      categories: current.categories.map((category, index) =>
        index === categoryIndex ? { ...category, name } : category
      )
    }));
  };

  const updateItem = <K extends keyof MenuItem>(
    categoryIndex: number,
    itemIndex: number,
    key: K,
    value: MenuItem[K]
  ) => {
    setData((current) => ({
      ...current,
      categories: current.categories.map((category, index) => {
        if (index !== categoryIndex) return category;
        return {
          ...category,
          items: category.items.map((item, nestedIndex) =>
            nestedIndex === itemIndex ? { ...item, [key]: value } : item
          )
        };
      })
    }));
  };

  const addCategory = () => {
    setData((current) => ({
      ...current,
      categories: [
        ...current.categories,
        {
          name: "新分类",
          items: [{ name: "新菜品", price: "¥", desc: "", tags: "" }]
        }
      ]
    }));
  };

  const deleteCategory = (categoryIndex: number) => {
    setData((current) => ({
      ...current,
      categories: current.categories.filter((_, index) => index !== categoryIndex)
    }));
  };

  const moveCategoryUp = (categoryIndex: number) => {
    if (categoryIndex === 0) return;
    setData((current) => {
      const categories = [...current.categories];
      [categories[categoryIndex - 1], categories[categoryIndex]] = [
        categories[categoryIndex],
        categories[categoryIndex - 1]
      ];
      return { ...current, categories };
    });
  };

  const addItem = (categoryIndex: number) => {
    setData((current) => ({
      ...current,
      categories: current.categories.map((category, index) =>
        index === categoryIndex
          ? {
              ...category,
              items: [
                ...category.items,
                { name: "新菜品", price: "¥", desc: "", tags: "" }
              ]
            }
          : category
      )
    }));
  };

  const deleteItem = (categoryIndex: number, itemIndex: number) => {
    setData((current) => ({
      ...current,
      categories: current.categories.map((category, index) =>
        index === categoryIndex
          ? {
              ...category,
              items: category.items.filter((_, nestedIndex) => nestedIndex !== itemIndex)
            }
          : category
      )
    }));
  };

  const moveItemUp = (categoryIndex: number, itemIndex: number) => {
    if (itemIndex === 0) return;
    setData((current) => ({
      ...current,
      categories: current.categories.map((category, index) => {
        if (index !== categoryIndex) return category;
        const items = [...category.items];
        [items[itemIndex - 1], items[itemIndex]] = [items[itemIndex], items[itemIndex - 1]];
        return { ...category, items };
      })
    }));
  };

  const clearAll = () => {
    setData((current) => ({
      name: "",
      meta: "",
      notice: "",
      theme: current.theme,
      density: current.density,
      categories: []
    }));
  };

  return (
    <main className="app grid min-h-screen grid-cols-[minmax(320px,430px)_1fr] max-[900px]:grid-cols-1">
      <aside
        className="editor max-h-screen overflow-auto border-r border-[var(--line)] bg-[rgba(255,250,241,.9)] p-[22px] max-[900px]:max-h-none max-[900px]:border-r-0 max-[900px]:border-b max-[560px]:p-4"
        aria-label="菜单编辑区"
      >
        <div className="mb-[18px] flex items-center justify-between gap-4 max-[560px]:items-stretch">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="grid size-[42px] shrink-0 place-items-center rounded-[var(--radius)] bg-[var(--accent)] text-white shadow-[0_10px_20px_rgba(184,75,54,.22)]"
              aria-hidden="true"
            >
              <Utensils size={24} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">AI菜单制作</h1>
              <p className="mt-1 text-[13px] text-[var(--muted)]">编辑内容，右侧实时预览</p>
            </div>
          </div>
        </div>

        <section className="border-t border-[var(--line)] py-[18px]">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-[15px] font-bold">餐厅信息</h2>
          </div>
          <div className="grid gap-3">
            <Label title="餐厅名称">
              <input
                className={fieldClass}
                maxLength={36}
                value={data.name}
                onChange={(event) => updateData("name", event.target.value)}
              />
            </Label>
            <Label title="副标题">
              <input
                className={fieldClass}
                value={data.meta}
                onChange={(event) => updateData("meta", event.target.value)}
              />
            </Label>
            <Label title="菜单备注">
              <textarea
                className={`${fieldClass} min-h-[74px] resize-y`}
                value={data.notice}
                onChange={(event) => updateData("notice", event.target.value)}
              />
            </Label>
            <div className="grid grid-cols-2 gap-2.5 max-[560px]:grid-cols-1">
              <Label title="风格">
                <select
                  className={fieldClass}
                  value={data.theme}
                  onChange={(event) => updateData("theme", event.target.value as Theme)}
                >
                  <option value="classic">热烈小馆</option>
                  <option value="elegant">雅致餐厅</option>
                  <option value="fresh">清新轻食</option>
                </select>
              </Label>
              <Label title="排版">
                <select
                  className={fieldClass}
                  value={data.density}
                  onChange={(event) => updateData("density", event.target.value as Density)}
                >
                  <option value="normal">舒展</option>
                  <option value="compact">紧凑</option>
                </select>
              </Label>
            </div>
          </div>
        </section>

        <section className="border-t border-[var(--line)] py-[18px]">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-[15px] font-bold">菜品分类</h2>
            <button
              className={`${textButtonClass} border-[var(--accent)] bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)]`}
              type="button"
              onClick={addCategory}
            >
              <Plus size={18} />
              新增分类
            </button>
          </div>

          {data.categories.map((category, categoryIndex) => (
            <div
              className="mb-3 rounded-[var(--radius)] border border-[var(--line)] bg-[rgba(255,255,255,.66)] p-3"
              key={`${category.name}-${categoryIndex}`}
            >
              <div className="mb-2.5 flex items-start justify-between gap-2">
                <Label title="分类名称">
                  <input
                    className={fieldClass}
                    maxLength={20}
                    value={category.name}
                    onChange={(event) => updateCategory(categoryIndex, event.target.value)}
                  />
                </Label>
                <div className="flex shrink-0 gap-1.5 pt-[22px]">
                  <button
                    className={iconButtonClass}
                    type="button"
                    title="上移分类"
                    aria-label="上移分类"
                    onClick={() => moveCategoryUp(categoryIndex)}
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    className={iconButtonClass}
                    type="button"
                    title="删除分类"
                    aria-label="删除分类"
                    onClick={() => deleteCategory(categoryIndex)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {category.items.map((item, itemIndex) => (
                <div
                  className="mt-3 border-t border-dashed border-[var(--line)] pt-3"
                  key={`${item.name}-${itemIndex}`}
                >
                  <div className="mb-2.5 flex items-center justify-between gap-2">
                    <strong>菜品</strong>
                    <div className="flex shrink-0 gap-1.5">
                      <button
                        className={iconButtonClass}
                        type="button"
                        title="上移菜品"
                        aria-label="上移菜品"
                        onClick={() => moveItemUp(categoryIndex, itemIndex)}
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button
                        className={iconButtonClass}
                        type="button"
                        title="删除菜品"
                        aria-label="删除菜品"
                        onClick={() => deleteItem(categoryIndex, itemIndex)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <div className="grid grid-cols-2 gap-2.5 max-[560px]:grid-cols-1">
                      <Label title="菜名">
                        <input
                          className={fieldClass}
                          maxLength={28}
                          value={item.name}
                          onChange={(event) =>
                            updateItem(categoryIndex, itemIndex, "name", event.target.value)
                          }
                        />
                      </Label>
                      <Label title="价格">
                        <input
                          className={fieldClass}
                          maxLength={12}
                          value={item.price}
                          onChange={(event) =>
                            updateItem(categoryIndex, itemIndex, "price", event.target.value)
                          }
                        />
                      </Label>
                    </div>
                    <Label title="描述">
                      <textarea
                        className={`${fieldClass} min-h-[74px] resize-y`}
                        maxLength={90}
                        value={item.desc}
                        onChange={(event) =>
                          updateItem(categoryIndex, itemIndex, "desc", event.target.value)
                        }
                      />
                    </Label>
                    <Label title="标签">
                      <input
                        className={fieldClass}
                        placeholder="招牌, 微辣, 新品"
                        value={item.tags}
                        onChange={(event) =>
                          updateItem(categoryIndex, itemIndex, "tags", event.target.value)
                        }
                      />
                    </Label>
                  </div>
                </div>
              ))}

              <button className={`${textButtonClass} mt-3`} type="button" onClick={() => addItem(categoryIndex)}>
                <Plus size={18} />
                添加菜品
              </button>
            </div>
          ))}
        </section>
      </aside>

      <section
        className="preview-wrap max-h-screen overflow-auto p-7 max-[900px]:max-h-none max-[560px]:p-4"
        aria-label="菜单预览区"
      >
        <div className="preview-shell mx-auto max-w-[980px]">
          <div className="preview-toolbar mb-[18px] flex items-center justify-between gap-3 max-[560px]:items-stretch">
            <h2 className="text-base font-bold">菜单预览</h2>
            <div className="flex flex-wrap gap-2">
              <button className={textButtonClass} type="button" onClick={() => setData(cloneData(defaultData))}>
                <RefreshCcw size={18} />
                示例
              </button>
              <button className={textButtonClass} type="button" onClick={clearAll}>
                <Trash2 size={18} />
                清空
              </button>
              <button
                className={`${textButtonClass} border-[var(--accent)] bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)]`}
                type="button"
                onClick={() => window.print()}
              >
                <Printer size={18} />
                打印 / PDF
              </button>
            </div>
          </div>

          <article className={menuPaperClass}>
            <div className="relative z-[1]">
              <header className="grid grid-cols-[1fr_auto] items-start gap-6 border-b-2 border-[var(--accent)] pb-6 max-[560px]:grid-cols-1">
                <div>
                  <h2 className="max-w-[800px] [overflow-wrap:anywhere] text-[clamp(34px,6vw,72px)] font-black leading-[.95]">
                    {data.name || "餐厅名称"}
                  </h2>
                  <p className="restaurant-meta mt-3 max-w-[640px] text-[var(--muted)] leading-[1.7]">
                    {data.meta}
                  </p>
                </div>
                <div className="grid aspect-square w-28 rotate-[7deg] place-items-center rounded-full border-2 border-[var(--accent)] p-3.5 text-center font-black leading-[1.1] text-[var(--accent)] max-[560px]:w-[88px]">
                  今日
                  <br />
                  菜单
                </div>
              </header>

              <div className="mt-8 grid grid-cols-2 gap-[var(--gap)] max-[900px]:grid-cols-1">
                {data.categories.length === 0 ? (
                  <div className="rounded-[var(--radius)] border border-dashed border-[var(--line)] bg-[rgba(255,255,255,.42)] p-[18px] text-[var(--muted)]">
                    添加分类和菜品后，菜单会显示在这里。
                  </div>
                ) : (
                  data.categories.map((category, categoryIndex) => (
                    <section className="break-inside-avoid" key={`${category.name}-preview-${categoryIndex}`}>
                      <h3 className="category-title mb-3.5 flex items-center gap-2.5 text-2xl font-bold text-[var(--accent-strong)]">
                        {category.name || "未命名分类"}
                      </h3>
                      {category.items.length === 0 ? (
                        <div className="rounded-[var(--radius)] border border-dashed border-[var(--line)] bg-[rgba(255,255,255,.42)] p-[18px] text-[var(--muted)]">
                          这个分类还没有菜品。
                        </div>
                      ) : (
                        category.items.map((item, itemIndex) => (
                          <DishPreview item={item} key={`${item.name}-preview-${itemIndex}`} />
                        ))
                      )}
                    </section>
                  ))
                )}
              </div>

              <p className="notice mt-8 border-t border-[rgba(32,33,36,.18)] pt-[18px] leading-[1.7] text-[var(--muted)]">
                {data.notice}
              </p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

function Label({
  title,
  children
}: Readonly<{
  title: string;
  children: ReactNode;
}>) {
  return (
    <label className="grid flex-1 gap-1.5 text-xs font-bold text-[var(--muted)]">
      {title}
      {children}
    </label>
  );
}

function DishPreview({ item }: Readonly<{ item: MenuItem }>) {
  const tags = item.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return (
    <div className="grid grid-cols-[1fr_auto] gap-x-[18px] gap-y-2.5 border-b border-dotted border-[rgba(32,33,36,.22)] py-[13px]">
      <div className="[overflow-wrap:anywhere] text-[17px] font-extrabold">
        {item.name || "未命名菜品"}
      </div>
      <div className="whitespace-nowrap text-[17px] font-black text-[var(--green)]">{item.price}</div>
      {item.desc ? (
        <div className="col-span-full -mt-1 text-[13px] leading-[1.55] text-[var(--muted)]">
          {item.desc}
        </div>
      ) : null}
      {tags.length ? (
        <div className="col-span-full mt-2 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              className="rounded-full border border-[rgba(184,75,54,.28)] bg-[rgba(255,255,255,.52)] px-2 py-[3px] text-[11px] font-extrabold text-[var(--accent-strong)]"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
