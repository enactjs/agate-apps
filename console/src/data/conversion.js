// General data manipulation utilities
//

const getLongLatFromSim = (easting, northing) => {
	const K0 = 0.9996;
	const E = 0.00669438;
	const E2 = E * E;
	const E3 = E2 * E;
	const E_P2 = E / (1.0 - E);

	const SQRT_E = Math.sqrt(1 - E);
	const _E = (1 - SQRT_E) / (1 + SQRT_E);
	const _E2 = _E * _E;
	const _E3 = _E2 * _E;
	const _E4 = _E3 * _E;
	const _E5 = _E4 * _E;

	const M1 = (1 - E / 4 - 3 * E2 / 64 - 5 * E3 / 256);

	const P2 = (3.0 / 2 * _E - 27.0 / 32 * _E3 + 269.0 / 512 * _E5);
	const P3 = (21.0 / 16 * _E2 - 55.0 / 32 * _E4);
	const P4 = (151.0 / 96 * _E3 - 417.0 / 128 * _E5);
	const P5 = (1097.0 / 512 * _E4);

	const R = 6378137;

	const x = easting - 500000;
	const y = northing;

	const m = y / K0;
	const mu = m / (R * M1);

	const pRad = (mu +
		P2 * Math.sin(2 * mu) +
		P3 * Math.sin(4 * mu) +
		P4 * Math.sin(6 * mu) +
		P5 * Math.sin(8 * mu));

	const pSin = Math.sin(pRad);
	const pSin2 = pSin * pSin;

	const pCos = Math.cos(pRad);

	const pTan = pSin / pCos;
	const pTan2 = pTan * pTan;
	const pTan4 = pTan2 * pTan2;

	const epSin = 1 - E * pSin2;
	const epSinSqrt = Math.sqrt(1 - E * pSin2);

	const n = R / epSinSqrt;
	const r = (1 - E) / epSin;

	const c = _E * pCos * pCos;
	const c2 = c * c;

	const d = x / (n * K0);
	const d2 = d * d;
	const d3 = d2 * d;
	const d4 = d3 * d;
	const d5 = d4 * d;
	const d6 = d5 * d;

	let lat = (pRad - (pTan / r) *
		(d2 / 2 -
		d4 / 24 * (5 + 3 * pTan2 + 10 * c - 4 * c2 - 9 * E_P2)) +
		d6 / 720 * (61 + 90 * pTan2 + 298 * c + 45 * pTan4 - 252 * E_P2 - 3 * c2));

	let lon = (d -
		d3 / 6 * (1 + 2 * pTan2 + c) +
		d5 / 120 * (5 - 2 * c + 28 * pTan2 - 3 * c2 + 8 * E_P2 + 24 * pTan4)) / pCos;

	lat = lat * 180.0 / Math.PI;
	lon = lon * 180.0 / Math.PI;

	const UTMZoneId = 10;
	lon = lon + (UTMZoneId - 1) * 6 - 180 + 3;
	return [lon, lat];
};

// Just reverse the values so we get a NORMAL LatLong instead of LongLat...
const getLatLongFromSim = (easting, northing) => getLongLatFromSim(easting, northing).slice().reverse();


export {
	getLongLatFromSim,
	getLatLongFromSim
};
