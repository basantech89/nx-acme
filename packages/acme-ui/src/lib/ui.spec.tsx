import { render } from '@testing-library/react';

import NxAcmeUi from './ui';

describe('NxAcmeUi', () => {
  
  it('should render successfully', () => {
    const { baseElement } = render(<NxAcmeUi />);
    expect(baseElement).toBeTruthy();
  });
  
});
