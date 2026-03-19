import { Body, Heading, Link, Tailwind, Text } from '@react-email/components';
import { Html } from '@react-email/html';
import React from 'react';

interface IResetPasswordTemplateProps {
  domain: string;
  token: string;
}

export const ResetPasswordTemplate = ({ domain, token }: IResetPasswordTemplateProps) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  return (
    <Tailwind>
      <Html>
        <Body className='text-black'>
          <Heading>Сброс пароля</Heading>
          <Text>
            Вы запросили сброс пароля. Перейдите по следующей ссылке, чтобы создать новый пароль:
          </Text>
          <Link href={resetLink}>Сбросить пароль</Link>
          <Text>
            Эта ссылка действительна в течение 1 часа. Если вы не запрашивали сброс пароля, просто
            проигнорируйте это сообщение.
          </Text>
        </Body>
      </Html>
    </Tailwind>
  );
};
