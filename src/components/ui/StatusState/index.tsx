import {
  FullWidthBg,
  Wrapper,
  Content,
  Title,
  Description,
} from './StatusState.styles';

type StatusStateProps = {
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
}: StatusStateProps) => {
  const isCompact = !icon && !description && !action;

  const content = (
    <Wrapper $compact={isCompact} $fullPage={fullPage}>
      {icon}
      <Content>
        <Title>{title}</Title>
        {description && <Description>{description}</Description>}
        {action}
      </Content>
    </Wrapper>
  );

  if (fullPage) {
    return <FullWidthBg>{content}</FullWidthBg>;
  }

  return content;
};
