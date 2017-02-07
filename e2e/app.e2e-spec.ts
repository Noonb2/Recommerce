import { RecommercePage } from './app.po';

describe('recommerce App', function() {
  let page: RecommercePage;

  beforeEach(() => {
    page = new RecommercePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
