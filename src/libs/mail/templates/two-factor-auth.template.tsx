import { Body, Heading, Tailwind, Text } from '@react-email/components';
import { Html } from '@react-email/html';
import React from 'react';

interface ITwoFactorAuthTemplateProps {
  token: string;
}

export const TwoFactorAuthTemplate = ({ token }: ITwoFactorAuthTemplateProps) => {
  return (
    <Tailwind>
      <Html>
        <Body className='text-black'>
          <Heading>Двухфакторная аутентификация</Heading>
          <Text>
            Ваш код двухфакторной аутентификации: <strong>{token}</strong>
          </Text>
          <Text>
            Введите данный код в приложении для завершения процесса аутентификации
          </Text>
          <Text>
            Если вы не запрашивали подтверждение, просто
            проигнорируйте это сообщение.
          </Text>
        </Body>
      </Html>
    </Tailwind>
  );
};
