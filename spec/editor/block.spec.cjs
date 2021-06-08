const Block = require("../../bin/Block.js").default;

describe("Block", function () {
  let block;
  beforeEach(() => {
    block = new Block();
  });

  it("length", function () {
    block.append("hello world");
    expect(block.length()).toEqual("hello world".length);

    const child = new Block();
    child.append(" my name is test");
    block.append(child);
    expect(block.length()).toEqual("hello world my name is test".length);
  });

  it("getLeafBlock", function () {
    const child = new Block();
    const child2 = new Block();
    const child3 = new Block();
    child.append(" child");
    child2.append(" child2");
    child3.append(" child3");

    block.append("block");
    block.append(child);
    expect(block.getLeafBlock()[1]).toBe(child);
    block.append(child2);
    expect(block.getLeafBlock()[1]).toBe(child2);
    block.append(child3);
    expect(block.getLeafBlock()[1]).toBe(child3);
  });

  it("findByPos", function () {
    const child = new Block();
    const child2 = new Block();
    const child3 = new Block();
    child.append(" child");
    child2.append(" child2");
    child3.append(" child3");

    block.append("block");
    block.append(child);
    let [b, n, pb, idx] = block.findByPos(0);
    expect(b.toString()).toBe("block");
    expect(n).toBe(0);
    expect(pb).toBe(block);
    expect(idx).toBe(0);

    [b, n, pb, idx] = block.findByPos(1);
    expect(b.toString()).toBe("block");
    expect(n).toBe(1);
    expect(pb).toBe(block);
    expect(idx).toBe(0);

    [b, n, pb, idx] = block.findByPos(2);
    expect(b.toString()).toBe("block");
    expect(n).toBe(2);
    expect(pb).toBe(block);
    expect(idx).toBe(0);

    [b, n, pb, idx] = block.findByPos(3);
    expect(b.toString()).toBe("block");
    expect(n).toBe(3);
    expect(pb).toBe(block);
    expect(idx).toBe(0);

    [b, n, pb, idx] = block.findByPos(4);
    expect(b.toString()).toBe("block");
    expect(n).toBe(4);
    expect(pb).toBe(block);
    expect(idx).toBe(0);

    [b, n, pb, idx] = block.findByPos(5);
    expect(b).toBe(child);
    expect(n).toBe(0);
    expect(pb).toBe(block);
    expect(idx).toBe(1);

    // [b, n, pb, idx] = block.findByPos(6);
    // expect(b.toString()).toBe(" child");
    // expect(n).toBe(0);
    // expect(pb).toBe(block);
    // expect(idx).toBe(1);
  });
});
