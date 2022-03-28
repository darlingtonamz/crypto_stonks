import { createApp } from "./util";

describe('GET /health', () => {
  it('should return status 200', async () => {
    const app = await createApp();

    const response = await app.inject({
      method: 'GET',
      url: '/health'
    })
    expect(response.statusCode).toBe(200);
  });

});
