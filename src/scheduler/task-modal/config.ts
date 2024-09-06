export const priorityOptions = [
  {
    label: "HIGHEST",
    value: "HIGHEST",
  },
  {
    label: "HIGH",
    value: "HIGH",
  },
  {
    label: "MEDIUM",
    value: "MEDIUM",
  },
  {
    label: "LOW",
    value: "LOW",
  },
  {
    label: "LOWEST",
    value: "LOWEST",
  },
];

export const datasourceTypes = [
  // {
  //   id: 0,
  //   code: "MYSQL",
  //   disabled: false,
  // },
  {
    id: 1,
    code: "POSTGRESQL",
    disabled: false,
  },
  // {
  //   id: 2,
  //   code: "HIVE",
  //   disabled: false,
  // },
  // {
  //   id: 3,
  //   code: "SPARK",
  //   disabled: false,
  // },
  {
    id: 4,
    code: "CLICKHOUSE",
    disabled: false,
  },
  // {
  //   id: 5,
  //   code: "ORACLE",
  //   disabled: false,
  // },
  // {
  //   id: 6,
  //   code: "SQLSERVER",
  //   disabled: false,
  // },
  // {
  //   id: 7,
  //   code: "DB2",
  //   disabled: false,
  // },
  // {
  //   id: 8,
  //   code: "PRESTO",
  //   disabled: false,
  // },
  // {
  //   id: 9,
  //   code: "REDSHIFT",
  //   disabled: false,
  // },
  // {
  //   id: 10,
  //   code: "ATHENA",
  //   disabled: false,
  // },
  // {
  //   id: 12,
  //   code: "TRINO",
  //   disabled: false,
  // },
  // {
  //   id: 13,
  //   code: "STARROCKS",
  //   disabled: false,
  // },
  // {
  //   id: 14,
  //   code: "AZURESQL",
  //   disabled: false,
  // },
  // {
  //   id: 15,
  //   code: "DAMENG",
  //   disabled: false,
  // },
  // {
  //   id: 15,
  //   code: "SSH",
  //   disabled: true,
  // },
  // {
  //   id: 16,
  //   code: "DATABEND",
  //   disabled: false,
  // },
  // {
  //   id: 21,
  //   code: "VERTICA",
  //   disabled: false,
  // },
  // {
  //   id: 22,
  //   code: "HANA",
  //   disabled: false,
  // },
  // {
  //   id: 23,
  //   code: "ZEPPELIN",
  //   disabled: false,
  // },
  // {
  //   id: 23,
  //   code: "DORIS",
  //   disabled: false,
  // },
  // {
  //   id: 24,
  //   code: "SAGEMAKER",
  //   disabled: false,
  // },
  // {
  //   id: 25,
  //   code: "KYUUBI",
  //   disabled: false,
  // },
  {
    id: 26,
    code: "DOLPHINDB",
    disabled: false,
  },
  {
    id: 27,
    code: "INCEPTOR",
    disabled: false,
  },
];

export const SQL_TYPES = [
  {
    value: "0",
    label: "查询",
  },
  {
    value: "1",
    label: "非查询",
  },
];

export const DISPLAY_ROWS = [
  {
    label: "1",
    value: 1,
  },
  {
    label: "10",
    value: 10,
  },
  {
    label: "25",
    value: 25,
  },
  {
    label: "50",
    value: 50,
  },
  {
    label: "100",
    value: 100,
  },
];

export const TYPE_LIST = [
  {
    value: "VARCHAR",
    label: "VARCHAR",
  },
  {
    value: "INTEGER",
    label: "INTEGER",
  },
  {
    value: "LONG",
    label: "LONG",
  },
  {
    value: "FLOAT",
    label: "FLOAT",
  },
  {
    value: "DOUBLE",
    label: "DOUBLE",
  },
  {
    value: "DATE",
    label: "DATE",
  },
  {
    value: "TIME",
    label: "TIME",
  },
  {
    value: "TIMESTAMP",
    label: "TIMESTAMP",
  },
  {
    value: "BOOLEAN",
    label: "BOOLEAN",
  },
  {
    value: "LIST",
    label: "LIST",
  },
  {
    value: "FILE",
    label: "FILE",
  },
];

export const DIRECT_LIST = [
  {
    value: "IN",
    label: "IN",
  },
  {
    value: "OUT",
    label: "OUT",
  },
];

export const jobSpeedByteOptions = [
  {
    label: `0(不限制)`,
    value: 0,
  },
  {
    label: "1KB",
    value: 1024,
  },
  {
    label: "10KB",
    value: 10240,
  },
  {
    label: "50KB",
    value: 51200,
  },
  {
    label: "100KB",
    value: 102400,
  },
  {
    label: "512KB",
    value: 524288,
  },
];

export const jobSpeedRecordOptions = [
  {
    label: `0(不限制)`,
    value: 0,
  },
  {
    label: "500",
    value: 500,
  },
  {
    label: "1000",
    value: 1000,
  },
  {
    label: "1500",
    value: 1500,
  },
  {
    label: "2000",
    value: 2000,
  },
  {
    label: "2500",
    value: 2500,
  },
  {
    label: "3000",
    value: 3000,
  },
];

export const memoryLimitOptions = [
  {
    label: "1G",
    value: 1,
  },
  {
    label: "2G",
    value: 2,
  },
  {
    label: "3G",
    value: 3,
  },
  {
    label: "4G",
    value: 4,
  },
];

export const filedTypeOptions = [
  {
    label: "timestamp",
    value: "timestamp",
  },
  {
    label: "string",
    value: "string",
  },
  {
    label: "char",
    value: "char",
  },
  {
    label: "varchar",
    value: "varchar",
  },
  {
    label: "varchar2",
    value: "varchar2",
  },
  {
    label: "int",
    value: "int",
  },
  {
    label: "bigint",
    value: "bigint",
  },
  {
    label: "tinyint",
    value: "tinyint",
  },
  {
    label: "smallint",
    value: "smallint",
  },
  {
    label: "date",
    value: "date",
  },
  {
    label: "float",
    value: "float",
  },
  {
    label: "double",
    value: "double",
  },
  {
    label: "boolean",
    value: "boolean",
  },
];

export default {};
