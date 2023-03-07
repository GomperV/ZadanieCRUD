package com.example.zadanieCrud;

import javax.persistence.*;

@Entity
@Table(name = "baza")
public class Campaigns {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Column(name = "name")
    private String name;

    @Column(name = "keywords")
    private String keywords;

    @Column(name = "bidAmount")
    private float bidAmount;

    @Column(name = "funds")
    private String funds;

    @Column(name = "published")
    private boolean published;

    @Column(name = "towns")
    private String towns;

    @Column(name = "radius")
    private int radius;

    public Campaigns() {

    }

    public Campaigns(long id, String name, String keywords, float bidAmount, String funds, boolean published, String towns, int radius) {
        this.id = id;
        this.name = name;
        this.keywords = keywords;
        this.bidAmount = bidAmount;
        this.funds = funds;
        this.published = published;
        this.towns = towns;
        this.radius = radius;
    }

    public Campaigns(String name, String keywords, boolean b) {
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getKeywords() {
        return keywords;
    }

    public void setKeywords(String keywords) {
        this.keywords = keywords;
    }

    public float getBidAmount() {
        return bidAmount;
    }

    public void setBidAmount(float bidAmount) {
        this.bidAmount = bidAmount;
    }

    public String getFunds() {
        return funds;
    }

    public void setFunds(String funds) {
        this.funds = funds;
    }

    public boolean isPublished() {
        return published;
    }

    public void setPublished(boolean published) {
        this.published = published;
    }

    public String getTowns() {
        return towns;
    }

    public void setTowns(String towns) {
        this.towns = towns;
    }

    public int getRadius() {
        return radius;
    }

    public void setRadius(int radius) {
        this.radius = radius;
    }

    @Override
    public String toString() {
        return "Campaigns{" + "id=" + id + ", name='" + name + '\'' + ", keywords='" + keywords + '\'' + ", bidAmount=" + bidAmount + ", funds='" + funds + '\'' + ", status=" + published + ", towns='" + towns + '\'' + ", radius=" + radius + '}';
    }
}

