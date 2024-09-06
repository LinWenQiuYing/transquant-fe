import { ajax, useForceUpdate } from "@transquant/utils";
import { Checkbox, Collapse, CollapseProps, message, Radio } from "antd";
import { CheckboxGroupProps } from "antd/es/checkbox";
import { observer } from "mobx-react";
import {
  forwardRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { useStores } from "../hooks";
import { DataPermissionItem, GuardianPermission } from "../types";
import { PERMISSION, ResourceProps } from "./Resource";

const TABLE_PERMISSION = ["SELECT", "INSERT", "UPDATE", "DELETE", "ADMIN"];

const DATABASEP_PERMISSION = ["CREATE", ...TABLE_PERMISSION];

export const PUBLIC_DATABASE_ID = 33;
export const GROUP_DATABASE_ID = 76;
const SEPARATOR = "-->";

const getPublicDBName = async () =>
  await ajax({ url: `/tqlab/dataresource/getPublicDBName` });

const getTablesByDBName = async (dbName: string) =>
  await ajax({
    url: `/tqlab/dataresource/getTablesByDBName`,
    params: { dbName },
  });

const getTeamDBName = async (type: number, teamId: number) =>
  await ajax({
    url: `/tqlab/dataresource/getTeamDBName`,
    params: { type, teamId },
  });

export default observer(
  forwardRef(function ResourceForData(props: ResourceProps, ref) {
    const {
      onChange,
      readonly,
      checkedValue,
      permissions,
      selectedGuardianPermissions,
    } = props;
    const { selectedGroup } = useStores().organizationStore;
    const selectedPermissions = useRef<GuardianPermission[]>([]);
    const update = useForceUpdate();

    useImperativeHandle(ref, () => ({
      selectedPermissions: selectedPermissions.current,
    }));

    useEffect(() => {
      if (selectedGuardianPermissions.length) {
        selectedPermissions.current = selectedGuardianPermissions;
        update();
      }
    }, [selectedGuardianPermissions]);

    const getOptions = (permission: DataPermissionItem) => {
      const options = Object.keys(PERMISSION)
        .map((item) => ({
          label: PERMISSION[+item as keyof typeof PERMISSION],
          value: `${permission.id}_${+item}`,
          vailable: !permission.available.includes(
            +item as unknown as 0 | 1 | 2 | 3
          ),
          disabled:
            readonly ||
            !permission.available.includes(+item as unknown as 0 | 1 | 2 | 3),
        }))
        .filter((item) => !item.vailable);

      return options;
    };

    const getValue = (permission: DataPermissionItem) => {
      const [value] = checkedValue.filter((item) =>
        item.startsWith(`${permission.id}`)
      );
      return value;
    };

    const menu = useMemo(() => {
      return {
        public: permissions.find((item) => item.id === PUBLIC_DATABASE_ID)!,
        group: permissions.find((item) => item.id === GROUP_DATABASE_ID)!,
      };
    }, [permissions]);

    type Item = {
      key: string;
      label: ReactNode;
      children: Item[];
    };

    const defaultItems: Item[] = useMemo(() => {
      return [
        {
          key: "public",
          label: (
            <div className="flex">
              <div className="w-24 mr-4 overflow-hidden min-w-24 text-ellipsis text-nowrap">
                公共资源
              </div>
              <Radio.Group
                onChange={onChange}
                options={getOptions(menu.public)}
                value={getValue(menu.public)}
                className="grid w-full grid-cols-4 gap-y-2"
              />
            </div>
          ),
          children: [],
        },
        {
          key: "group",
          label: (
            <div className="flex">
              <div className="w-24 mr-4 overflow-hidden min-w-24 text-ellipsis text-nowrap">
                团队空间
              </div>
              <Radio.Group
                onChange={onChange}
                options={getOptions(menu.group)}
                value={getValue(menu.group)}
                className="grid w-full grid-cols-4 gap-y-2"
              />
            </div>
          ),
          children: [],
        },
      ];
    }, [checkedValue]);

    const [items, setItems] = useState<Item[]>(defaultItems);

    const onDataBaseCheckboxChange =
      (databaseName: string): CheckboxGroupProps["onChange"] =>
      (checkedValue) => {
        const tempPermissions = selectedPermissions.current.filter((item) => {
          // 保留表数据
          if (item.table) return true;
          return item.db !== databaseName;
        });
        if (checkedValue.length === 0) {
          selectedPermissions.current = tempPermissions;
          update();
          return;
        }

        const res = (checkedValue as string[]).reduce((acc, cur) => {
          const [database, permission] = cur.split(SEPARATOR);
          return {
            db: database,
            permissions: [...(acc.permissions || []), permission],
          };
        }, {} as GuardianPermission);

        const finalPermissions = [...tempPermissions, res];

        selectedPermissions.current = finalPermissions;
        update();
      };

    const getDatabaseCheckboxValue = (databaseName: string) => {
      const [database] = selectedPermissions.current
        .filter((item) => item.db === databaseName)
        .filter((item) => !item.table);
      if (!database) return undefined;

      const checkedValue = database.permissions.map(
        (permission) => `${database.db}${SEPARATOR}${permission}`
      );

      return checkedValue;
    };

    const renderDatabaseItems = (dbs: string[]) => {
      return dbs.map((item) => {
        return {
          key: item,
          label: (
            <div className="flex">
              <div className="w-24 mr-4 overflow-hidden min-w-24 text-ellipsis text-nowrap">
                {item}
              </div>
              <Checkbox.Group
                defaultValue={getDatabaseCheckboxValue(item)}
                onChange={onDataBaseCheckboxChange(item)}
                options={DATABASEP_PERMISSION.map((permission) => ({
                  label: permission,
                  value: `${item}${SEPARATOR}${permission}`,
                }))}
              />
            </div>
          ),
          children: [],
        };
      });
    };

    const renderDatabase = async (
      databaseType: "public" | "group",
      type: number
    ) => {
      const cloneItems = [...items];

      const dbs: string[] =
        databaseType === "public"
          ? await getPublicDBName()
          : await getTeamDBName(type, selectedGroup!.id);

      const dbItems = renderDatabaseItems(dbs);

      const findItem = cloneItems.find(
        (item) => item.key === databaseType
      )! as any;

      if (findItem) {
        findItem.children = dbItems;
      }
      setItems(cloneItems);
    };

    const [databaseType, setDataseType] = useState<"public" | "group">();

    const onCollapseChange = (key: string | string[]) => {
      const [currentItem] = key;
      setDataseType(undefined);
      if (!currentItem) return;
      const currentItemId =
        currentItem === "public" ? PUBLIC_DATABASE_ID : GROUP_DATABASE_ID;
      const permission = permissions.find((item) => item.id === currentItemId);
      if (!permission) return;

      const findItem = checkedValue.find((item) =>
        item.startsWith(`${permission.id}`)
      )!;
      if (!findItem) {
        message.info("请先选择数据权限类型");
        return;
      }
      const databaseId = findItem.split("_")?.[0] || 0;
      const type: number = +findItem.split("_")?.[1];
      const databaseType: "public" | "group" =
        +databaseId === PUBLIC_DATABASE_ID ? "public" : "group";

      setDataseType(databaseType);
      if (type === -1) {
        message.info("权限类型为无权限");
        return;
      }

      renderDatabase(databaseType, type);
    };

    const onTableCheckboxChange =
      (tableName: string): CheckboxGroupProps["onChange"] =>
      (checkedValue) => {
        const tempPermissions = selectedPermissions.current.filter((item) => {
          // 保留库数据
          if (!item.table) return true;
          return item.table !== tableName;
        });
        if (checkedValue.length === 0) {
          selectedPermissions.current = tempPermissions;
          update();
          return;
        }

        const res = (checkedValue as string[]).reduce((acc, cur) => {
          const [database, tableName, permission] = cur.split(SEPARATOR);
          return {
            db: database,
            permissions: [...(acc.permissions || []), permission],
            table: tableName,
          };
        }, {} as GuardianPermission);

        const finalPermissions = [...tempPermissions, res];

        selectedPermissions.current = finalPermissions;
        update();
      };

    const getTableCheckboxValue = (tableName: string) => {
      const [table] = selectedPermissions.current.filter(
        (item) => item.table === tableName
      );
      if (!table) return undefined;

      const checkedValue = table.permissions.map(
        (permission) =>
          `${table.db}${SEPARATOR}${table.table}${SEPARATOR}${permission}`
      );

      return checkedValue;
    };

    const renderTables = async (databaseName: string) => {
      if (!databaseName) return [];
      const cloneItems = [...items];
      const currentItem = cloneItems
        .find((item) => item.key === databaseType)!
        .children?.find((item) => item.key === databaseName);

      const tables: string[] = await getTablesByDBName(databaseName);
      const tableItems = tables.map((item) => {
        return {
          key: item,
          label: (
            <div className="flex">
              <div className="w-24 mr-4 overflow-hidden min-w-24 text-ellipsis text-nowrap">
                {item}
              </div>
              <Checkbox.Group
                defaultValue={getTableCheckboxValue(item)}
                onChange={onTableCheckboxChange(item)}
                options={TABLE_PERMISSION.map((permission) => ({
                  label: permission,
                  value: `${databaseName}${SEPARATOR}${item}${SEPARATOR}${permission}`,
                }))}
              />
            </div>
          ),
          children: [],
        };
      });

      if (currentItem) {
        currentItem.children = tableItems;
      }

      setItems(cloneItems);
    };

    const onDatabaseCollapseChange = async (key: string | string[]) => {
      const [databaseName] = key;
      if (!databaseName) return;

      await renderTables(databaseName);
    };

    const getTableItems = (items: null | Item[]) => {
      if (!items?.length) return [];
      return items.map((item) => ({
        key: item.key,
        label: item.label,
        showArrow: false,
        children: null,
      }));
    };

    const getDatabaseItems = (items: null | Item[]) => {
      if (!items?.length) return [];
      return items.map((item) => ({
        key: item.key,
        label: item.label,
        children: (
          <Collapse
            items={getTableItems(item.children)}
            collapsible="icon"
            accordion
          />
        ),
      })) as CollapseProps["items"];
    };

    const getItems = (items: Item[] | null): CollapseProps["items"] => {
      if (!items) return [];
      const getShowArrow = (item: Item) => {
        if (item.key === "public") {
          const [value] = checkedValue.filter((item) =>
            item.startsWith(`${PUBLIC_DATABASE_ID}`)
          );
          if (!value) return false;
          const [id, type] = value?.split("_");

          if (+id === PUBLIC_DATABASE_ID && +type === -1) {
            return false;
          }
        }
        if (item.key === "group") {
          const [value] = checkedValue.filter((item) =>
            item.startsWith(`${GROUP_DATABASE_ID}`)
          );
          if (!value) return false;
          const [id, type] = value?.split("_");

          if (+id === GROUP_DATABASE_ID && +type === -1) {
            return false;
          }
        }

        return true;
      };
      return items.map((item) => {
        return {
          key: item.key,
          label: item.label,
          showArrow: getShowArrow(item),
          children: (
            <Collapse
              items={getDatabaseItems(item.children)}
              collapsible="icon"
              onChange={onDatabaseCollapseChange}
              accordion
            />
          ),
        };
      }) as CollapseProps["items"];
    };

    useEffect(() => {
      const tempItems = defaultItems.map((item) => {
        const cur = items.find((i) => i.key === item.key);
        if (cur?.children.length) {
          item.children = cur.children;
        }
        return item;
      });
      setItems(tempItems);
    }, [readonly, checkedValue]);

    useEffect(() => {
      setDataseType(undefined);
    }, [checkedValue]);

    return (
      <Collapse
        activeKey={databaseType}
        items={getItems(items)}
        collapsible="icon"
        onChange={onCollapseChange}
        destroyInactivePanel
        accordion
      />
    );
  })
);
