/* eslint-disable */
// Work heavily in progress

/* This is intentionally "dumb" to avoid recursion as much as possible in order to avoid hitting TS's recursion limit. */
type Spaces = (
  | "                    "
  | "                   "
  | "                  "
  | "                 "
  | "                "
  | "               "
  | "              "
  | "             "
  | "            "
  | "           "
  | "          "
  | "         "
  | "        "
  | "       "
  | "      "
  | "     "
  | "    "
  | "   "
  | "  "
  | " "
);

type TrimEnd<T extends string> = (
  T extends `${infer Rest}${Spaces | "\n"}`
  ? TrimEnd<Rest>
  : T
);


type TrimStart<T extends string> = (
  T extends `${Spaces | "\n"}${infer Rest}`
  ? TrimStart<Rest>
  : T
);

type Trim<T extends string> = TrimEnd<TrimStart<T>>;

type ParseAttributes<T extends string> = (
  T extends `${infer Key}="${infer Value}"${infer Rest}` | `${infer Key}='${infer Value}'${infer Rest}`
  ? (
    ParseAttributes<Rest>[0] extends `ERROR${infer ErrorMessage}`
    ? [`ERROR${ErrorMessage}`]
    : [
      [
        Key: TrimStart<Key>,
        Value: Value,
      ],
      ...ParseAttributes<Rest>,
    ]
  )
  : Trim<T> extends "" ? [] 
  : [`ERROR: invalid attribute syntax at '${T}'`]
);

type ParseTagInfo<T extends string> = (
  T extends `${infer Tag}${"\n" | " "}${infer Rest}`
  ? [
    TagName: TrimEnd<Tag>,
    Attributes: ParseAttributes<Rest>,
  ]
  : [
    TagName: T,
    Attributes: [],
  ]
);

type ParseTextNode<T extends string> = (
  Trim<T> extends ""
  ? []
  : [{
    type: "text"
    content: Trim<T>,
  }]
);

type ParseXml<
    T extends string,
> = (
  /* Tag */
  T extends `<${infer TagInfo}>${infer Rest}` ? (
    /* Self-closing tag */
    TagInfo extends `${infer ActualTagInfo}/`
    ? (
      ParseTagInfo<ActualTagInfo>[1] extends [`ERROR${infer ErrorMessage}`]
        ? [`ERROR${ErrorMessage}\n  at <${TagInfo}>`] :
      ParseXml<Rest> extends [`ERROR${infer ErrorMessage}`]
        ? [`ERROR${ErrorMessage}`] :
      [
        {
          type: "element",
          tagName: ParseTagInfo<ActualTagInfo>[0],
          attributes: ParseTagInfo<ActualTagInfo>[1],
          children: [],
        },
        ...ParseXml<Rest>,
      ]
    )
    /* Open tag */
    : (
      Rest extends `${infer Children}</${ParseTagInfo<TagInfo>[0]}>${infer Siblings}` 
      ? (
        ParseXml<Children> extends [`ERROR${infer ErrorMessage}`]
          ? [`ERROR${ErrorMessage}\n  at <${TagInfo}>`] :
        ParseTagInfo<TagInfo>[1] extends [`ERROR${infer ErrorMessage}`]
          ? [`ERROR${ErrorMessage}\n  at <${TagInfo}>`] :
        ParseXml<Siblings> extends [`ERROR${infer ErrorMessage}`]
          ? [`ERROR${ErrorMessage}`] :
        [
          {
            type: "element",
            tagName: ParseTagInfo<TagInfo>[0],
            attributes: ParseTagInfo<TagInfo>[1],
            children: ParseXml<Children>,
          },
          ...ParseXml<Siblings>,
        ]
      )
      : [
        `ERROR: no closing tag for '${ParseTagInfo<TagInfo>[0]}' at <${TagInfo}>`,
      ]
    )
  ):

  T extends `${infer Start}<${infer Rest}`
  ? (
    ParseXml<`<${Rest}`> extends [`ERROR${infer ErrorMessage}`]
    ? [`ERROR${ErrorMessage}`]
    : [
      ...ParseTextNode<Start>,
      ...ParseXml<`<${Rest}`>,
    ]
  ) :


  T extends "" ? [] :
  Trim<T> extends "" ? [] :
  ParseTextNode<T>
);

type TextNode = {
  type: "text",
  content: string,
};

type ElementNode = {
  type: "element",
  tagName: string,
  attributes: ReadonlyArray<[Key: string, Value: string]>,
  children: Xml,
};

type Xml = ReadonlyArray<ElementNode | TextNode>;




type Foo = ParseXml<`<div class="foo" hidden=""/>`>;
const foo: Xml = {} as Foo;

type Bar = ParseXml<`
  <div
    class="foo" 
    hidden=""
  >
    <i>Hello!</i>
  </div>
`>;
const bar: Xml = {} as Bar;

type Baz = ParseXml<`<div class="foo" hidden=""><i>Hello!</i>`>;
//@ts-expect-error Should error because the XML is invalid.
const baz: Xml = {} as Baz;

type Fiz = ParseXml<`<div class="foo" hidden><i>Hello!</i></div>`>;
//@ts-expect-error Should error because the XML is invalid.
const fiz: Xml = {} as Fiz;

type Qux = ParseXml<`
  <pog/>
  Wow!
  <div class="foo" hidden="">
    <i>Hello!</i>
    <b>This is nested</b>
  </div>
  <span id="bar" />
`>;
const qux: Xml = {} as Qux;




type Quz = ParseXml<`
  <pog/>
  Wow!
  <div class="foo" hidden="">
    <i>Hello!</i>
    <b test>This is nested</b>
  </div>
  <span id="bar" />
`>;

//@ts-expect-error Should error because the XML is invalid.
const quz: Xml = {} as Quz;




declare function xml<T extends TemplateStringsArray> (strings: TemplateStringsArray): ParseXml<T[0]>;

type TemplateStringsArrayOf<T extends ReadonlyArray<unknown>> = TemplateStringsArray & T;







const parsed = xml<TemplateStringsArrayOf<["<foo></foo>"]>>`<foo></foo>`;


