import { Controller, Get, Render, Post, Body, HttpRedirectResponse, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Account } from './Account';
import { OpenAccountDto } from './OpenAccount.dto';
import { Response } from 'express';
import { error } from 'console';

@Controller()
export class AppController {
  #accounts: Account[] = [
    {
      id: '1111-2222',
      balance: 15000,
      owner: 'Admin',
      createdAt: new Date(2020, 1, 1)
    },
    {
      id: '1234-5678',
      balance: 200000,
      owner: 'User12',
      createdAt: new Date(2021, 12, 1)
    }, 
    {
      id: '2233-4455',
      balance: 0,
      owner: 'New User 2',
      createdAt: new Date()
    }
  ];

  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }

  @Get('openAccount')
  @Render('openAccountForm')
  openAccountForm(){
    return {
      data: {},
      errors: []
    }
  }

  @Post('openAccount')
  openAccount(@Body() openAccountDto: OpenAccountDto, @Res() response: Response){
    
    let errors = [];

    if(!openAccountDto.id || !openAccountDto.balance || !openAccountDto.owner){
      errors.push("Minden mezőt kötelező kitölteni!")
    }

    if(!/^\d{4}-\d{4}$/.test(openAccountDto.id)){
      errors.push("Helytelen a számlaszám formátuma! (Megfelelő formátum: 0000-0000)")
    }

    let balance = parseInt(openAccountDto.balance);
    if(balance < 0){
      errors.push('Az egyenleg nem lehet negatív!');
    } else{
      const acc = this.#accounts.find(acc => acc.id == openAccountDto.id);
      if(acc != undefined){
        errors.push('A számlaszám már létezik!')
      }
    }

    if(errors.length > 0){
      response.render('openAccountForm', {
        data: openAccountDto,
        errors
      })
      return;
    }
    
    const newAccount: Account = {
      id: openAccountDto.id,
      balance: parseInt(openAccountDto.balance),
      owner: openAccountDto.owner,
      createdAt: new Date()
    }
    this.#accounts.push(newAccount)
    console.log(this.#accounts)

    response.redirect('/openAccountSucces')
  }

  @Get('openAccountSucces')
  openAccountSucces(){
    return 'Sikeres létrehozás'
  }

}
