import type { AriaAttributes } from 'react';
import {
  FullWidthBg,
  Wrapper,
  Content,
  Title,
  Description,
} from './StatusState.styles';

type StatusStateProps = AriaAttributes & {
  title: string;
  icon?: React.ReactNode;
  description?: string;
  action?: React.ReactNode;
  fullPage?: boolean;
};

export const StatusState = ({
  title,
  icon,
  description,
  action,
  fullPage,
  ...ariaProps
}: StatusStateProps) => {
  const isCompact = !icon && !description && !action;

  const content = (
    <Wrapper
      role="status"
      $compact={isCompact}
      $fullPage={fullPage}
      {...ariaProps}
    >
      <Content>
        <Title>{icon}{' '}{title}</Title>
        {description && <Description>{description}</Description>}
      </Content>
      {action}
    </Wrapper>
  );

  if (fullPage) {
    return <FullWidthBg>{content}</FullWidthBg>;
  }

  return content;
};
