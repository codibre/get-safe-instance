import { delay } from 'src/delay';
import { getSafeInstance } from '../../src';

const myObj = {
  async test1() {
    throw new Error();
  },
  async test2() {
    return 'ok';
  },
  async test3() {
    await delay(200);
    return 'not ok';
  },
  test4() {
    return 'result 4';
  },
  test5: 123,
};

describe(getSafeInstance.name, () => {
  it('should return a instance of the object that ignores any error in any promise method listed', async () => {
    const wrappedObj = getSafeInstance(myObj, 100, ['test1', 'test2', 'test3']);

    const result1 = await wrappedObj.test1();
    const result2 = await wrappedObj.test2();
    const result3 = await wrappedObj.test3();

    expect(result1).toBeUndefined();
    expect(result2).toBe('ok');
    expect(result3).toBeUndefined();
  });

  it('should return a instance of the object that does not ignores errors in not listed promise method', async () => {
    const wrappedObj = getSafeInstance(myObj, 100, ['test2', 'test3']);
    let thrownError: any;

    try {
      await wrappedObj.test1();
    } catch (err) {
      thrownError = err;
    }

    expect(thrownError).toBeInstanceOf(Error);
  });

  it('should return the value of non function properties', async () => {
    const wrappedObj = getSafeInstance(myObj, 100, ['test2', 'test3']);

    const result = wrappedObj.test5;

    expect(result).toBe(123);
  });
});
