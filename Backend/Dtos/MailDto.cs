﻿using System;
namespace Email.Management.Dtos
{
    public class MailDto
    {
        public string Name { get; set; }
        public string Host { get; set; }
        public int Port { get; set; }
        public bool EnableSsl { get; set; }
        public string EmailAddress { get; set; }
        public string Password { get; set; }
    }
}