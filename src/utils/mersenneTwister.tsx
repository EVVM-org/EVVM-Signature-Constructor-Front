// Mersenne Twister random number generator implementation.
function mersenneTwister(seed: number) {
  const N = 624;
  const M = 397;
  const MATRIX_A = 0x9908b0df;
  const UPPER_MASK = 0x80000000;
  const LOWER_MASK = 0x7fffffff;
  const MAG01 = [0, MATRIX_A];

  const mt = new Uint32Array(N);
  let mti = 0;
  mt[0] = seed >>> 0;
  for (mti = 1; mti < N; mti++) {
    mt[mti] = (1812433253 * (mt[mti - 1] ^ (mt[mti - 1] >>> 30)) + mti) >>> 0;
  }

  /* Generates a random number on [0,0xFFFFFFFF]-interval. */
  function int32() {
    let y;

    if (mti >= N) {
      let kk = 0;
      for (; kk < N - M; kk++) {
        y = (mt[kk] & UPPER_MASK) | (mt[kk + 1] & LOWER_MASK);
        mt[kk] = mt[kk + M] ^ (y >>> 1) ^ MAG01[y & 1];
      }
      for (; kk < N - 1; kk++) {
        y = (mt[kk] & UPPER_MASK) | (mt[kk + 1] & LOWER_MASK);
        mt[kk] = mt[kk + (M - N)] ^ (y >>> 1) ^ MAG01[y & 1];
      }
      y = (mt[N - 1] & UPPER_MASK) | (mt[0] & LOWER_MASK);
      mt[N - 1] = mt[M - 1] ^ (y >>> 1) ^ MAG01[y & 1];
      mti = 0;
    }

    y = mt[mti++];

    y ^= y >>> 11;
    y ^= (y << 7) & 0x9d2c5680;
    y ^= (y << 15) & 0xefc60000;
    y ^= y >>> 18;

    return y >>> 0;
  }

  /* Generates a random number on [0,1]-real-interval. */
  function real1() {
    return int32() * (1.0 / 4294967295.0); // Divided by 2^32-1
  }
      const a = int32() >>> 5,
        b = int32() >>> 6;
  function real2() {
    return int32() * (1.0 / 4294967296.0); // Divided by 2^32
  }

  /* Generates a random number on (0,1)-real-interval. */
  function real3() {
    return (int32() + 0.5) * (1.0 / 4294967296.0); // Divided by 2^32
  }

  /* Generates a random number on [0,1) with 53-bit resolution. */
  function res53() {
    return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
  }

  return { int32, real1, real2, real3, res53 };
}

export default mersenneTwister;
