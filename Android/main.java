package fi.jukka.appview;

import android.annotation.TargetApi;
import android.app.Activity;
import android.app.PendingIntent;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.res.Resources;

// @JUKKA: otetaan käyttöön kaikki mahdolliset NFC -kilkkeet
import android.nfc.NfcAdapter;
import android.nfc.tech.IsoDep;
import android.nfc.tech.MifareClassic;
import android.nfc.tech.MifareUltralight;
import android.nfc.tech.Ndef;
import android.nfc.tech.NfcA;
import android.nfc.tech.NfcB;
import android.nfc.tech.NfcF;
import android.nfc.tech.NfcV;
// --
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;

// @JUKKA: nämä otetaan järjestelmän piilottamista varten (lukitaan ohjelma)
import android.view.Window;
import android.view.WindowManager;

// @JUKKA: WebKit + Chrome -ominaisuudet käyttöön webbisovellusta varten
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
/ ---
import android.widget.LinearLayout;
import android.widget.Toast;

import android.app.admin.DevicePolicyManager;

import fi.necom.promidmobile.util.SystemUiHider;


public class main extends Activity {

    final Activity activity = this;

    // @JUKKA: URL haluttuun ympäristöön
    public static final String URL = "http://www.palvelu.com/app";

    // @JUKKA: MIME-tyyppi
    public static final String MIME_TEXT_PLAIN = "text/plain";

    private LinearLayout mTagContent;

    // @JUKKA: alustetaan mNfcAdapter
    private NfcAdapter mNfcAdapter;

    // @JUKKA: haetaan NFC-tekniikkalistat
    private final String[][] techList = new String[][] {
            new String[] {
                    NfcA.class.getName(),
                    NfcB.class.getName(),
                    NfcF.class.getName(),
                    NfcV.class.getName(),
                    IsoDep.class.getName(),
                    MifareClassic.class.getName(),
                    MifareUltralight.class.getName(), Ndef.class.getName()
            }
    };

    // @JUKKA: sitten piiloitellaan järjestelmäfunktioita (nappeja)
    public static DevicePolicyManager mDPM;
    ComponentName devAdminReceiver;

    private static final boolean AUTO_HIDE = true;
    private static final int AUTO_HIDE_DELAY_MILLIS = 3000;
    private static final boolean TOGGLE_ON_CLICK = false;
    private static final int HIDER_FLAGS = SystemUiHider.FLAG_HIDE_NAVIGATION;

    private SystemUiHider mSystemUiHider;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // @JUKKA: kikkailua ja asetuksia kioskimoodiin:
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED);

        setContentView(R.layout.activity_main);

        // @JUKKA: alustetaan appView (WebView-luokka) ja haetaan sille
        //         käyttöliittymästä kohde webView (WebKit)
        WebView appView = (WebView) findViewById(R.id.webView);

        // @JUKKA: alustetaan WebSettings
        WebSettings webSettings = appView.getSettings();

        // @JUKKA: enabloidaan JavaScript
        webSettings.setJavaScriptEnabled(true);
        webSettings.setAppCacheEnabled(true);

        // @JUKKA: otetaan Chromen JavaScript-ominaisuudet mukaan
        appView.setWebChromeClient(new WebChromeClient() {
            public void onProgressChanged(WebView view, int progress) {
                activity.setTitle("Loading...");
                activity.setProgress(progress * 100);

                if (progress == 100)
                    activity.setTitle(R.string.app_name);
            }
        });


        // @JUKKA: tehdään viive, koska kaikki laitteet ei aina
        //         hetkessä yhdistä nettiin uudelleenkäynnistyksessä
        try {
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        // @JUKKA: ladataan URL
        appView.loadUrl(this.URL);

        // @JUKKA: asennetaan mNfcAdapter
        mNfcAdapter = NfcAdapter.getDefaultAdapter(this);

        /**
         * @JUKKA: tsekataan onko laitteistossa NFC -lukijaa ja jos ei,
         *         niin valitetaan
         */
        if (mNfcAdapter == null) {
            Toast.makeText(this, "Tässä laitteessa ei ole NFC -lukijaa. Ohjelmaa ei voida käyttää tässä järjestelmässä.", Toast.LENGTH_LONG).show();
            finish();
            return;
        }

        // @JUKKA: valitellaan myös, jos se ei ole kytkettynä päälle
        if (!mNfcAdapter.isEnabled()) {
            Toast.makeText(this, "NFC-lukija ei ole kytketty päälle. Kytke NFC-lukija päälle ja käynnistä ohjelma uudestaan.", Toast.LENGTH_LONG).show();
        }

        final View controlsView = findViewById(R.id.fullscreen_content_controls);
        final View contentView = findViewById(R.id.fullscreen_content);


        mSystemUiHider = SystemUiHider.getInstance(this, contentView, HIDER_FLAGS);
        mSystemUiHider.setup();
        mSystemUiHider
                .setOnVisibilityChangeListener(new SystemUiHider.OnVisibilityChangeListener() {

                    int mControlsHeight;
                    int mShortAnimTime;

                    @Override
                    @TargetApi(Build.VERSION_CODES.HONEYCOMB_MR2)
                    public void onVisibilityChange(boolean visible) {
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB_MR2) {

                            if (mControlsHeight == 0) {
                                mControlsHeight = controlsView.getHeight();
                            }

                            if (mShortAnimTime == 0) {
                                mShortAnimTime = getResources().getInteger(
                                        android.R.integer.config_shortAnimTime);
                            }

                            controlsView.animate()
                                    .translationY(visible ? 0 : mControlsHeight)
                                    .setDuration(mShortAnimTime);
                        } else {

                            controlsView.setVisibility(visible ? View.VISIBLE : View.GONE);
                        }

                        if (visible && AUTO_HIDE) {
                            delayedHide(AUTO_HIDE_DELAY_MILLIS);
                        }
                    }
                });
                
                

        // @JUKKA: kokeillaan piilotella Androidin omia järjestelmänappeja
        contentView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (TOGGLE_ON_CLICK) {
                    mSystemUiHider.toggle();
                } else {
                    mSystemUiHider.show();
                }
            }
        });

        // @JUKKA: allaolevalla lukitaan Android Lollipop (5.0+) käyttämään ohjelmaa:
        // startLockTask();

    }


	// @JUKKA: Ohjelman palautuessa säilytetään kaikki toiminnot
    @Override
    protected void onResume() {
        super.onResume();

        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, new Intent(this, getClass()).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP), 0);

        IntentFilter filter = new IntentFilter();
        filter.addAction(NfcAdapter.ACTION_TAG_DISCOVERED);
        filter.addAction(NfcAdapter.ACTION_NDEF_DISCOVERED);
        filter.addAction(NfcAdapter.ACTION_TECH_DISCOVERED);

        NfcAdapter nfcAdapter = NfcAdapter.getDefaultAdapter(this);
        nfcAdapter.enableForegroundDispatch(this, pendingIntent, new IntentFilter[]{filter}, this.techList);
    }
    
    
    
	/*
    *  @JUKKA: disabloidaan paluunapin muu käyttö, mutta annetaan sille
    *          sensijaan WebViewin refresh-käsky (lataa sivun uusiksi)
    */
    @Override
    public void onBackPressed() {
        WebView appView = (WebView) findViewById(R.id.webView);
        appView.loadUrl(this.URL);
        return;
    }
    

    

    /*
    * @JUKKA: jos ohjelma ajetaan taustalle, läväytetään se uudestaan esiin
    *         kun näytetään NFC -tagia.
    */
    @Override
    protected void onPause() {
        super.onPause();

        NfcAdapter nfcAdapter = NfcAdapter.getDefaultAdapter(this);
        nfcAdapter.disableForegroundDispatch(this);

    }



	// @JUKKA: NFC-luvun tapahduttua kirjaudutaan WebViewissä olevan ohjelman sessioon
    @Override
    protected void onNewIntent(Intent intent) {
        if (intent.getAction().equals(NfcAdapter.ACTION_TAG_DISCOVERED)) {

            WebView appView = (WebView) findViewById(R.id.webView);
            appView.loadUrl("javascript:Session.login('" + ByteArrayToHexString(intent.getByteArrayExtra(NfcAdapter.EXTRA_ID)) + "')");

        }
    }
    


    // @JUKKA: muuta saatu array hexaluvuksi (NFC-kulkukortteja varten)
    private String ByteArrayToHexString(byte [] inarray) {
        int i, j, in;
        String [] hex = {"0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"};
        String out= "";

        for(j = 0 ; j < inarray.length ; ++j)
        {
            in = (int) inarray[j] & 0xff;
            i = (in >> 4) & 0x0f;
            out += hex[i];
            i = in & 0x0f;
            out += hex[i];
        }
        return out;
    }

   // @JUKKA: piilotellaan
    View.OnTouchListener mDelayHideTouchListener = new View.OnTouchListener() {
        @Override
        public boolean onTouch(View view, MotionEvent motionEvent) {
            if (AUTO_HIDE) {
                delayedHide(AUTO_HIDE_DELAY_MILLIS);
            }
            return false;
        }
    };


    // @JUKKA: kikkaillaan lisää piilotuksien kanssa (myös vanhemmissa Androideissa)

    Handler mHideHandler = new Handler();
    Runnable mHideRunnable = new Runnable() {
        @Override
        public void run() {
            mSystemUiHider.hide();
        }
    };

    private void delayedHide(int delayMillis) {
        mHideHandler.removeCallbacks(mHideRunnable);
        mHideHandler.postDelayed(mHideRunnable, delayMillis);
    }
}