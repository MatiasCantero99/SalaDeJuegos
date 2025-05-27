import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  public isLoggedIn$ = new BehaviorSubject<boolean>(false);


  constructor() {
    this.supabase = createClient(environment.supabaseUrl,environment.supabaseKey);
    this.checkSession();


   }

   async checkSession() {
    const { data: { session } } = await this.supabase.auth.getSession();
    this.isLoggedIn$.next(!!session);

    this.supabase.auth.onAuthStateChange((event, session) => {
      this.isLoggedIn$.next(!!session);
    });
  }

  getSupabase() {
    return this.supabase;
  }

  async logout() {
    await this.supabase.auth.signOut();
  }
}
