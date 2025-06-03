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

  async loginWithEmail(email: string, password: string) {
  const { data, error } = await this.supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;

  return data.user;
}

async getUser() {
  const { data, error } = await this.supabase.auth.getUser();
  if (error) {
    console.error('Error al obtener usuario:', error);
    return null;
  }
  return data.user;
}


async getUsuarioExtendido() {
  const { data: sessionData } = await this.supabase.auth.getUser();
  const user = sessionData.user;

  if (!user) throw new Error('Usuario no autenticado');

  const { data, error } = await this.supabase
    .from('miTabla') 
    .select('email')
    .eq('authId', user.id)
    .single();

  if (error) throw error;

  return { ...data, mail: user.email };
}

async logout() {
  try {
    await this.supabase.auth.signOut();
    localStorage.clear();
    this.isLoggedIn$.next(false); 
  } catch (error: any) {
    console.error('Error al cerrar sesión:', error.message);
  }
}

async guardarScore(nombreJuego: string, puntaje: number) {
  const { data: sessionData } = await this.supabase.auth.getUser();
  const user = sessionData.user;

  if (!user) return;

  const { error } = await this.supabase
    .from('score')
    .insert([
      {
        mail: user.email,
        score: puntaje,
        juego: nombreJuego
      }
    ]);

  if (error) console.error('Error al guardar score:', error.message);
}


}
