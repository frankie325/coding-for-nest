import * as Spec from 'pactum/src/models/Spec';

describe('AppController (e2e)', () => {
  let spec: Spec;
  beforeEach(() => {
    // console.log('app', global.app);
    // pactum.request.setBaseUrl('http://localhost:3000');
    spec = global.spec as Spec;
  });

  it('/ (GET)', () => {
    // return request(app.getHttpServer())
    //   .get('/api')
    //   .expect(200)
    //   .expect('Hello World!');

    return spec
      .get('/api')
      .expectStatus(200)
      .expectBodyContains('Hello World!');
  });
});
