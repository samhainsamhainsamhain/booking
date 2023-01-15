import dynamic from "next/dynamic";
import Image from "next/image";
import React, { FC, useState } from "react";
import { api } from "src/utils/api";
import { capitalize, selectOptions } from "src/utils/helpers";

const DynamicSelect = dynamic(() => import("react-select"), { ssr: false });

type MenuProps = {};

const Menu: FC<MenuProps> = ({}: MenuProps) => {
  const { data: menuItems } = api.menu.getMenuItems.useQuery();
  const [filter, setFilter] = useState<string | undefined>("");

  const filteredMenuItems = menuItems?.filter((menuItem) => {
    if (!filter) return true;

    return menuItem.categories.includes(filter);
  });

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="flex w-full justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            On Our Menu
          </h2>
          <DynamicSelect
            onChange={(event) => {
              // @ts-ignore
              if (event?.value === "all") setFilter(undefined);
              // @ts-ignore
              else setFilter(event?.value);
            }}
            className="border-none outline-none"
            options={selectOptions}
          />
        </div>
        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {filteredMenuItems?.map((menuItem) => (
            <div className="group relative" key={menuItem.id}>
              <div className="min-h-80 aspect-w-1 aspect-h-1 lg:aspect-none relative w-full overflow-hidden">
                <Image
                  src={menuItem.url}
                  alt={menuItem.name}
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  width={400}
                  height={400}
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <a>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {menuItem.name}
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {menuItem.categories
                      .map((category) => capitalize(category))
                      .join(", ")}
                  </p>
                </div>
                <h2 className="text-xl text-gray-700">${menuItem.price}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
