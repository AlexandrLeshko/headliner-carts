import styled from '@emotion/styled';

export const Wrapper = styled.div`
  position: relative;
`;

export const Trigger = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  gap: 0.25rem;
  width: 100%;
  padding: 0.5rem 0.5rem 0.5rem 0.75rem;
  background-color: ${({ theme }) => theme.colors.dropdownTrigger};
  border: 2px solid ${({ theme }) => theme.colors.border};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover, &:focus {
    background-color: #99fc77;
    transform: translate(-0.1rem, -0.1rem);
    box-shadow: 0.2rem 0.2rem 0 0 #000;
  }
`;

export const Menu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  left: 0;
  right: 0;
  z-index: 10;
  margin-top: 0.5rem;
  background-color: #fff;
  border: 2px solid #000;
  transform: translate(-0.1rem, -0.1rem);
  box-shadow: 0.2rem 0.2rem 0 0 #000;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

export const MenuItem = styled.button`
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  text-align: left;
  border-bottom: 2px dashed ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: background-color 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:hover, &:focus {
    background-color: ${({ theme }) => theme.colors.dropdownHover};
  }
`;
