import * as request from 'supertest';
import { HttpServer } from '@nestjs/common';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export class ApiRequest {
    private static readonly jwtToken: string = readFileSync(
        resolve(__dirname, '../', 'dummytoken.txt'),
        'utf-8',
    ).replace('\n', '');

    static async get(httpServer: HttpServer, url: string, useAuth?: boolean): Promise<request.Test> {
        const req = request.agent(httpServer).get(url).set('Accept', 'application/json');

        if (useAuth) {
            req.set('Authorization', `Bearer ${ApiRequest.jwtToken}`);
        }

        return req;
    }

    static async post(
        httpServer: HttpServer,
        url: string,
        data: Record<string, unknown>,
        useAuth?: boolean,
    ): Promise<request.Test> {
        const req = request.agent(httpServer).post(url).set('Accept', 'application/json');

        if (useAuth) {
            req.set('Authorization', `Bearer ${ApiRequest.jwtToken}`);
        }

        return req.send(data);
    }

    static async put(
        httpServer: HttpServer,
        url: string,
        data: Record<string, unknown>,
        useAuth?: boolean,
    ): Promise<request.Test> {
        const req = request.agent(httpServer).put(url).set('Accept', 'application/json');

        if (useAuth) {
            req.set('Authorization', `Bearer ${ApiRequest.jwtToken}`);
        }

        return req.send(data);
    }

    static async delete(httpServer: HttpServer, url: string, useAuth?: boolean): Promise<request.Test> {
        const req = request.agent(httpServer).delete(url).set('Accept', 'application/json');

        if (useAuth) {
            req.set('Authorization', `Bearer ${ApiRequest.jwtToken}`);
        }

        return req;
    }
}
