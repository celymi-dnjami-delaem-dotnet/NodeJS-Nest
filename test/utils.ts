export class TestUtils {
    static getUrlWithId(baseUrl: string, id: string): string {
        return `${baseUrl}/id/${id}`;
    }

    static getSoftRemoveUrlWithId(baseUrl: string, id: string): string {
        return `${baseUrl}/soft-remove/id/${id}`;
    }
}
