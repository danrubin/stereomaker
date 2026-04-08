import Testing
@testable import StereoMaker

struct AlignmentParamsTests {
    @Test func identityHasExpectedDefaults() {
        let params = AlignmentParams.identity
        #expect(params.translateX == 0)
        #expect(params.translateY == 0)
        #expect(params.rotateDeg == 0)
        #expect(params.scale == 1.0)
        #expect(params.keystoneX == 0)
        #expect(params.keystoneY == 0)
    }

    @Test func roundtripsJSON() throws {
        let params = AlignmentParams(translateX: 3.5, translateY: -1.2, rotateDeg: 0.5, scale: 1.02)
        let data = try JSONEncoder().encode(params)
        let decoded = try JSONDecoder().decode(AlignmentParams.self, from: data)
        #expect(params == decoded)
    }
}
