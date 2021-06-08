const StringBuffer = require("../../bin/StringBuffer.js").default;

describe("StringBuffer", function () {
  let sbuff = new StringBuffer();
  beforeEach(() => {
    sbuff.clear();
  });

  it("length", function () {
    sbuff.append("text");
    sbuff.insert(1, "1234");

    expect(sbuff.length()).toEqual("t1234ext".length);
  });

  it("append", function () {
    sbuff.append("text");
    sbuff.append("1234");

    expect(sbuff.equals("text1234")).toEqual(true);
  });

  it("insert", function () {
    sbuff.append("text");
    sbuff.insert(1, "1234");

    expect(sbuff.equals("t1234ext")).toEqual(true);
  });

  it("delete", function () {
    sbuff.append("text");
    sbuff.delete(1);

    expect(sbuff.equals("t")).toEqual(true);

    sbuff.clear();

    sbuff.append("text");
    sbuff.delete(1, 3);

    expect(sbuff.equals("tt")).toEqual(true);

    sbuff.clear();
    sbuff.append("text");
    sbuff.delete(0, 1);
    expect(sbuff.equals("ext")).toEqual(true);

    sbuff.clear();
    sbuff.append("text");
    sbuff.delete(1, 1);
    expect(sbuff.equals("text")).toEqual(true);

    sbuff.clear();
    sbuff.append("textabcd");
    sbuff.delete(1, 3);
    expect(sbuff.equals("ttabcd")).toEqual(true);
  });
});
